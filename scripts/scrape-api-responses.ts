/* eslint-disable */
import 'dotenv/config';
import { Tank01Client } from '../src/client.js';
import { writeFile, mkdir } from 'fs/promises';
import { inspect } from 'util';
import { join } from 'path';

const DOCS_DIR = 'api-responses';

async function main() {
  const client = new Tank01Client();
  const httpClient = (client as any).httpClient;

  try {
    await mkdir(DOCS_DIR, { recursive: true });
    console.log(`Created directory: ${DOCS_DIR}`);
  } catch (err) {
    console.error(`Error creating directory: ${DOCS_DIR}`, err);
    return;
  }

  console.log('Fetching initial data for reference...');
  const { body: players } = await httpClient.get('/getNFLPlayerList');
  const { body: teams } = await httpClient.get('/getNFLTeams');
  const { body: games } = await httpClient.get('/getNFLGamesForWeek', {
    week: '12',
    season: '2024',
  });

  const methodsToScrape = [
    // Teams
    {
      name: 'getNFLTeams',
      calls: [
        {},
        { rosters: true },
        { schedules: true },
        { topPerformers: true },
        { teamStats: true, teamStatsSeason: '2024' },
        { rosters: true, teamStats: true, teamStatsSeason: '2024', schedules: true },
      ],
    },
    {
      name: 'getNFLTeam',
      calls: () => teams.slice(0, 3).map((t: any) => t.teamAbv),
    },
    {
      name: 'getNFLTeamRoster',
      calls: () => {
        const teamSamples = teams.slice(0, 3);
        return [
          ...teamSamples.map((t: any) => ({ teamAbv: t.teamAbv })),
          ...teamSamples.map((t: any) => ({ teamAbv: t.teamAbv, getStats: true })),
          ...teamSamples.map((t: any) => ({
            teamAbv: t.teamAbv,
            getStats: true,
            fantasyPoints: true,
          })),
        ];
      },
    },
    { name: 'getNFLDepthCharts', calls: [{}] },

    // Players
    { name: 'getNFLPlayerList', calls: [{}] },
    {
      name: 'getNFLPlayerInfo',
      calls: () => {
        const qb = players.find((p: any) => p.pos === 'QB');
        const rb = players.find((p: any) => p.pos === 'RB');
        const wr = players.find((p: any) => p.pos === 'WR');
        return [qb, rb, wr]
          .filter(Boolean)
          .map((p: any) => ({ playerID: p.playerID, getStats: true }));
      },
    },
    {
      name: 'getNFLGamesForPlayer',
      calls: () => {
        const qb = players.find((p: any) => p.pos === 'QB');
        const rb = players.find((p: any) => p.pos === 'RB');
        return [
          { playerID: qb.playerID },
          { playerID: qb.playerID, numberOfGames: 5 },
          { playerID: rb.playerID, fantasyPoints: true },
        ].filter((call: any) => call.playerID);
      },
    },

    // Games
    {
      name: 'getNFLGamesForWeek',
      calls: [
        { week: '1', season: '2024' },
        { week: '12', season: '2024' },
        { week: '1', season: '2024', seasonType: 'reg' },
      ],
    },
    {
      name: 'getNFLGameInfo',
      calls: () => games.slice(0, 2).map((g: any) => g.gameID),
    },
    {
      name: 'getNFLTeamSchedule',
      calls: () => teams.slice(0, 3).map((t: any) => t.teamAbv),
    },
    {
      name: 'getNFLGamesForDate',
      calls: [{ gameDate: '20240905' }, { gameDate: '20241124' }],
    },
    {
      name: 'getNFLScoresOnly',
      calls: [{ season: '2024', week: '1' }, { season: '2024', week: '12' }, {}],
    },

    // Live
    {
      name: 'getNFLBoxScore',
      calls: () => {
        const finalGames = games.filter(
          (g: any) => g.gameStatus === 'Final' || g.gameStatus?.includes('Final')
        );
        return finalGames
          .slice(0, 2)
          .map((g: any) => [
            { gameID: g.gameID },
            { gameID: g.gameID, playByPlay: true, fantasyPoints: true },
          ])
          .flat();
      },
    },

    // Fantasy
    {
      name: 'getNFLADP',
      calls: ['PPR', 'halfPPR', 'standard'],
    },
    {
      name: 'getNFLProjections',
      calls: [
        { week: '1' },
        { week: '12' },
        { playerID: players.find((p: any) => p.pos === 'QB')?.playerID },
      ].filter((c: any) => c.week || c.playerID),
    },
    {
      name: 'getNFLDFS',
      calls: ['20240905', '20241124'],
    },

    // Odds
    {
      name: 'getNFLBettingOdds',
      calls: [
        { gameDate: '20240905' },
        { gameDate: '20241124' },
        { gameDate: '20240905', playerProps: true },
      ],
    },

    // News
    {
      name: 'getNFLNews',
      calls: [{}, { recentNews: true, maxItems: 5 }, { teamAbv: 'SF', maxItems: 3 }],
    },

    // Info
    {
      name: 'getNFLCurrentInfo',
      calls: [{}, { date: '20240905' }],
    },
  ];

  for (const { name, calls } of methodsToScrape) {
    let paramsToCall: any[] = [];
    if (typeof calls === 'function') {
      paramsToCall = calls();
    } else {
      paramsToCall = calls;
    }

    const allResults: any[] = [];

    for (const params of paramsToCall) {
      try {
        console.log(
          `Calling ${name} with params: ${inspect(params, { depth: null, colors: true })}`
        );

        const endpointName = `/${name}`;
        const queryParams =
          typeof params === 'string'
            ? name === 'getNFLADP'
              ? { adpType: params }
              : { gameID: params }
            : params;

        const { body: result } = await httpClient.get(endpointName, queryParams);

        allResults.push({
          params: queryParams,
          result: result,
          resultType: Array.isArray(result) ? 'array' : typeof result,
          arrayLength: Array.isArray(result) ? result.length : null,
          sampleKeys:
            result && typeof result === 'object'
              ? Array.isArray(result) && result.length > 0
                ? Object.keys(result[0] || {})
                : Object.keys(result)
              : [],
        });
      } catch (err) {
        console.error(`Error calling ${name} with params ${inspect(params)}:`, err);
        allResults.push({
          params: params,
          error: (err as Error).message,
        });
      }
    }

    // Write both JSON and markdown
    const jsonPath = join(DOCS_DIR, `${name}.json`);
    const mdPath = join(DOCS_DIR, `${name}.md`);

    try {
      // Write comprehensive JSON
      await writeFile(jsonPath, JSON.stringify(allResults, null, 2));
      console.log(`Successfully wrote to ${jsonPath}`);

      // Write readable markdown
      let markdownContent = `# Method: ${name}\n\n`;
      markdownContent += `Total calls: ${allResults.length}\n\n`;

      for (let i = 0; i < allResults.length; i++) {
        const result = allResults[i];
        markdownContent += `## Call ${i + 1}\n\n`;
        markdownContent += `### Parameters\n\n\`\`\`json\n${JSON.stringify(result.params, null, 2)}\n\`\`\`\n\n`;

        if (result.error) {
          markdownContent += `### Error\n\n\`\`\`\n${result.error}\n\`\`\`\n\n`;
        } else {
          markdownContent += `### Response Type: ${result.resultType}\n\n`;
          if (result.arrayLength !== null) {
            markdownContent += `Array length: ${result.arrayLength}\n\n`;
          }
          markdownContent += `### Sample Keys\n\n\`\`\`json\n${JSON.stringify(result.sampleKeys, null, 2)}\n\`\`\`\n\n`;

          // Include full result for small responses, sample for large ones
          let resultToShow = result.result;
          if (Array.isArray(result.result) && result.result.length > 2) {
            resultToShow = result.result.slice(0, 2);
            markdownContent += `### Sample Response (showing 2 of ${result.result.length})\n\n`;
          } else {
            markdownContent += `### Full Response\n\n`;
          }
          markdownContent += `\`\`\`json\n${JSON.stringify(resultToShow, null, 2)}\n\`\`\`\n\n`;
        }
        markdownContent += `---\n\n`;
      }

      await writeFile(mdPath, markdownContent);
      console.log(`Successfully wrote to ${mdPath}`);
    } catch (err) {
      console.error(`Error writing files for ${name}:`, err);
    }
  }

  // Create summary analysis
  console.log('\n=== Creating Summary Analysis ===\n');
  const summaryPath = join(DOCS_DIR, '_SUMMARY.md');
  let summary = `# API Scraping Summary\n\nGenerated: ${new Date().toISOString()}\n\n`;
  summary += `## Endpoints Scraped\n\n`;
  summary += `Total endpoints: ${methodsToScrape.length}\n\n`;
  summary += methodsToScrape.map((m) => `- ${m.name}`).join('\n');
  summary += `\n\n## Next Steps\n\n`;
  summary += `1. Review JSON files for complete type structures\n`;
  summary += `2. Compare with existing TypeScript types\n`;
  summary += `3. Update types with missing properties\n`;
  summary += `4. Pay special attention to getNFLTeamRoster for roster player type\n`;

  await writeFile(summaryPath, summary);
  console.log(`\nSummary written to ${summaryPath}`);
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
});

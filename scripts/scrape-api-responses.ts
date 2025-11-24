/* eslint-disable */
import 'dotenv/config';
import { Tank01Client } from '../src/client.js';
import { writeFile, mkdir } from 'fs/promises';
import { inspect } from 'util';
import { join } from 'path';

const DOCS_DIR = 'api-docs';

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

  const { body: players } = await httpClient.get('/getNFLPlayerList');
  const { body: teams } = await httpClient.get('/getNFLTeams');
  const { body: games } = await httpClient.get('/getNFLGamesForWeek', { week: '1', season: '2024' });

  const methodsToScrape = [
    { name: 'getNFLTeams', calls: [{}, { rosters: true }] },
    { name: 'getNFLTeam', calls: () => teams.slice(0, 2).map((t: any) => t.teamAbv) },
    { name: 'getNFLTeamRoster', calls: () => teams.slice(0, 2).map((t: any) => ({ teamAbv: t.teamAbv, getStats: true })) },
    { name: 'getNFLDepthCharts', calls: [{}] },
    { name: 'getNFLPlayerList', calls: [{}] },
    { name: 'getNFLPlayerInfo', calls: () => players.slice(0, 2).map((p: any) => ({ playerID: p.playerID })) },
    { name: 'getNFLGamesForPlayer', calls: () => {
        const qb = players.find((p: any) => p.pos === 'QB');
        const rb = players.find((p: any) => p.pos === 'RB');
        return [qb, rb].filter(Boolean).map((p: any) => ({ playerID: p.playerID }));
      }
    },
    { name: 'getNFLGamesForWeek', calls: [{ week: '1', season: '2024' }] },
    { name: 'getNFLGameInfo', calls: () => games.slice(0, 1).map((g: any) => g.gameID) },
    { name: 'getNFLTeamSchedule', calls: () => teams.slice(0, 2).map((t: any) => t.teamAbv) },
    { name: 'getNFLGamesForDate', calls: [{ gameDate: '20240905' }] },
    { name: 'getNFLScoresOnly', calls: [{ season: '2024', week: '1' }] },
    { name: 'getNFLBoxScore', calls: () => {
        const finalGames = games.filter((g: any) => g.gameStatus === 'Final');
        return finalGames.slice(0, 1).map((g: any) => ({ gameID: g.gameID }));
      }
    },
    { name: 'getNFLADP', calls: ['PPR', 'halfPPR'] },
    { name: 'getNFLProjections', calls: [{ week: '1' }] },
    { name: 'getNFLDFS', calls: ['20240905'] },
    { name: 'getNFLBettingOdds', calls: [{ gameDate: '20240905' }] },
    { name: 'getNFLNews', calls: [{}] },
    { name: 'getNFLCurrentInfo', calls: [{}] },
  ];

  for (const { name, calls } of methodsToScrape) {
    let paramsToCall: any[] = [];
    if (typeof calls === 'function') {
      paramsToCall = calls();
    } else {
      paramsToCall = calls;
    }

    let markdownContent = `# Method: /${name}\n\n`;

    for (const params of paramsToCall) {
      try {
        console.log(`Calling ${name} with params: ${inspect(params, { depth: null, colors: true })}`);
        
        const endpointName = `/${name}`;
        const { body: result } = await httpClient.get(endpointName, typeof params === 'string' ? { adpType: params} : params);
        
        let resultToStore = result;
        if (Array.isArray(result)) {
          resultToStore = result.slice(0, 1);
        }
        
        markdownContent += `## Parameters: 

\
${JSON.stringify(resultToStore, null, 2)}
\

`;

      } catch (err) {
        console.error(`Error calling ${name} with params ${inspect(params)}:`, err);
        markdownContent += `## Parameters: 

\
${JSON.stringify({ error: (err as Error).message }, null, 2)}
\

`;
      }
    }

    const filePath = join(DOCS_DIR, `${name}.md`);
    try {
      await writeFile(filePath, markdownContent);
      console.log(`Successfully wrote to ${filePath}`);
    } catch (err) {
      console.error(`Error writing to file ${filePath}:`, err);
    }
  }
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
});

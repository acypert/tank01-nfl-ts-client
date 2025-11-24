import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TeamSchema } from './teams/schemas.js';
import { PlayerGameSchema } from './players/schemas.js';
import { GameSchema } from './games/schemas.js';
import { LiveBoxScoreSchema } from './live/schemas.js';
import { PlayerADPSchema } from './fantasy/schemas.js';
import { PlayerProjectionSchema, TeamDefenseProjectionSchema } from './fantasy/schemas.js';
import { GameOddsSchema } from './odds/schemas.js';
import { NewsArticleSchema } from './news/schemas.js';
import { CurrentInfoSchema } from './info/schemas.js';
import { DepthChartSchema } from './teams/schemas.js';

const readApiDoc = (fileName: string): unknown[] => {
  const filePath = join(process.cwd(), 'api-responses', fileName);
  const content = readFileSync(filePath, 'utf-8');
  const responses: unknown[] = [];

  // Match each "## Call N" section and extract the response after "### Sample Response" or "### Full Response"
  // The regex looks for the response JSON after these headers
  const callRegex =
    /## Call \d+[\s\S]*?### (?:Full Response|Sample Response[^\n]*)[\s\S]*?```json\n([\s\S]*?)```/g;
  let match;

  while ((match = callRegex.exec(content)) !== null) {
    const jsonString = match[1]?.trim();
    if (jsonString) {
      try {
        responses.push(JSON.parse(jsonString));
      } catch (e) {
        // Skip invalid JSON blocks
        console.warn(`Failed to parse JSON in ${fileName}:`, e);
      }
    }
  }
  return responses;
};

describe('API Schema Validation', () => {
  it('should validate TeamSchema from getNFLTeams.md', () => {
    const data = readApiDoc('getNFLTeams.md');
    // The first response is an array of teams without rosters
    const teamsWithout = data[0] as unknown[];
    expect(Array.isArray(teamsWithout)).toBe(true);
    const parsedTeam = TeamSchema.parse(teamsWithout[0]);
    expect(parsedTeam).toBeDefined();
    expect(parsedTeam.Roster).toBeUndefined();

    // The second response is an array of teams with rosters
    const teamsWithRosters = data[1] as unknown[];
    expect(Array.isArray(teamsWithRosters)).toBe(true);
    const parsedTeamWithRosters = TeamSchema.parse(teamsWithRosters[0]);
    expect(parsedTeamWithRosters).toBeDefined();
    expect(parsedTeamWithRosters.Roster).toBeDefined();
  });

  it('should validate PlayerGameSchema from getNFLGamesForPlayer.md', () => {
    const data = readApiDoc('getNFLGamesForPlayer.md');
    // The structure is { gameID: PlayerGame }
    const playerGames = data[0] as Record<string, unknown>;
    const firstGameId = Object.keys(playerGames)[0];
    expect(firstGameId).toBeDefined();
    if (!firstGameId) throw new Error('No game ID found');
    const playerGame = playerGames[firstGameId];
    const parsedPlayerGame = PlayerGameSchema.parse(playerGame);
    expect(parsedPlayerGame).toBeDefined();
  });

  it('should validate GameSchema from getNFLGamesForWeek.md', () => {
    const data = readApiDoc('getNFLGamesForWeek.md');
    // The structure is an array of games
    const games = data[0] as unknown[];
    expect(Array.isArray(games)).toBe(true);
    const parsedGame = GameSchema.parse(games[0]);
    expect(parsedGame).toBeDefined();
  });

  it('should validate LiveBoxScoreSchema from getNFLBoxScore.md', () => {
    const data = readApiDoc('getNFLBoxScore.md');
    // The structure is a single object within an array
    const liveBoxScore = data[0];
    const parsedLiveBoxScore = LiveBoxScoreSchema.parse(liveBoxScore);
    expect(parsedLiveBoxScore).toBeDefined();
  });

  it('should validate PlayerADPSchema from getNFLADP.md', () => {
    const data = readApiDoc('getNFLADP.md');
    // The structure is an object with adpList property
    const adpResponse = data[0] as { adpList: unknown[] };
    expect(adpResponse.adpList).toBeDefined();
    const parsedPlayerADP = PlayerADPSchema.parse(adpResponse.adpList[0]);
    expect(parsedPlayerADP).toBeDefined();
  });

  it('should validate PlayerProjectionSchema and TeamDefenseProjectionSchema from getNFLProjections.md', () => {
    const data = readApiDoc('getNFLProjections.md');
    // The structure is an object with playerProjections and teamDefenseProjections
    const projections = data[0] as {
      playerProjections: Record<string, unknown>;
      teamDefenseProjections: Record<string, unknown>;
    };

    const firstPlayerId = Object.keys(projections.playerProjections)[0];
    expect(firstPlayerId).toBeDefined();
    if (!firstPlayerId) throw new Error('No player ID found');
    const playerProjection = projections.playerProjections[firstPlayerId];
    const parsedPlayerProjection = PlayerProjectionSchema.parse(playerProjection);
    expect(parsedPlayerProjection).toBeDefined();

    const firstTeamId = Object.keys(projections.teamDefenseProjections)[0];
    expect(firstTeamId).toBeDefined();
    if (!firstTeamId) throw new Error('No team ID found');
    const teamDefenseProjection = projections.teamDefenseProjections[firstTeamId];
    const parsedTeamDefenseProjection = TeamDefenseProjectionSchema.parse(teamDefenseProjection);
    expect(parsedTeamDefenseProjection).toBeDefined();
  });
  it('should validate GameOddsSchema from getNFLBettingOdds.md', () => {
    const data = readApiDoc('getNFLBettingOdds.md');
    // The structure is an object with game odds
    const oddsData = data[0] as Record<string, unknown>;
    const firstGameId = Object.keys(oddsData)[0];
    expect(firstGameId).toBeDefined();
    if (!firstGameId) throw new Error('No game ID found');
    const gameOdds = oddsData[firstGameId];
    const parsedGameOdds = GameOddsSchema.parse(gameOdds);
    expect(parsedGameOdds).toBeDefined();
  });

  it('should validate NewsArticleSchema from getNFLNews.md', () => {
    const data = readApiDoc('getNFLNews.md');
    // NewsArticleSchema expects an array (may be empty)
    const parsedNewsArticle = NewsArticleSchema.parse(data[0]);
    expect(parsedNewsArticle).toBeDefined();
    expect(Array.isArray(parsedNewsArticle)).toBe(true);
  });

  it('should validate CurrentInfoSchema from getNFLCurrentInfo.md', () => {
    const data = readApiDoc('getNFLCurrentInfo.md');
    // The structure is a single object within an array
    const currentInfo = data[0];
    const parsedCurrentInfo = CurrentInfoSchema.parse(currentInfo);
    expect(parsedCurrentInfo).toBeDefined();
  });

  it('should validate DepthChartSchema from getNFLDepthCharts.md', () => {
    const data = readApiDoc('getNFLDepthCharts.md');
    // The structure is an array of depth charts
    const depthCharts = data[0] as unknown[];
    expect(Array.isArray(depthCharts)).toBe(true);
    const parsedDepthChart = DepthChartSchema.parse(depthCharts[0]);
    expect(parsedDepthChart).toBeDefined();
  });
});

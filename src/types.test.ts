import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TeamSchema } from './teams/schemas';
import { PlayerGameSchema } from './players/schemas';
import { GameSchema } from './games/schemas';
import { LiveBoxScoreSchema } from './live/schemas';
import { PlayerADPSchema } from './fantasy/schemas';
import { PlayerProjectionSchema, TeamDefenseProjectionSchema } from './fantasy/schemas';
import { GameOddsSchema } from './odds/schemas';
import { NewsArticleSchema } from './news/schemas';
import { CurrentInfoSchema } from './info/schemas';
import { DepthChartSchema } from './teams/schemas';

const readApiDoc = (fileName: string) => {
  const filePath = join(process.cwd(), 'api-docs', fileName);
  const content = readFileSync(filePath, 'utf-8');
  const jsonBlocks: any[] = [];
  const regex = /## Parameters: (?:`(.+?)`)?\n\n([\s\S]*?)(?=(?:\n## Parameters:)|$)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const jsonString = match[2].trim();
    if (jsonString) {
      jsonBlocks.push(JSON.parse(jsonString));
    }
  }
  return jsonBlocks;
};

describe('API Schema Validation', () => {
  it('should validate TeamSchema from getNFLTeams.md', () => {
    const data = readApiDoc('getNFLTeams.md');
    // The first entry in getNFLTeams.md is without rosters
    const teamWithoutRosters = data[0][0]; // Access the first element of the first array
    const parsedTeam = TeamSchema.parse(teamWithoutRosters);
    expect(parsedTeam).toBeDefined();
    expect(parsedTeam.Roster).toBeUndefined();

    // The second entry in getNFLTeams.md is with rosters
    const teamWithRosters = data[1][0]; // Access the first element of the second array
    const parsedTeamWithRosters = TeamSchema.parse(teamWithRosters);
    expect(parsedTeamWithRosters).toBeDefined();
    expect(parsedTeamWithRosters.Roster).toBeDefined();
  });

  it('should validate PlayerGameSchema from getNFLGamesForPlayer.md', () => {
    const data = readApiDoc('getNFLGamesForPlayer.md');
    // The structure is { gameID: PlayerGame } within an array
    const firstGameId = Object.keys(data[0])[0];
    const playerGame = data[0][firstGameId];
    const parsedPlayerGame = PlayerGameSchema.parse(playerGame);
    expect(parsedPlayerGame).toBeDefined();
  });

  it('should validate GameSchema from getNFLGamesForWeek.md', () => {
    const data = readApiDoc('getNFLGamesForWeek.md');
    // The structure is an array of games within an array
    const game = data[0][0];
    const parsedGame = GameSchema.parse(game);
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
    // The structure is an object with adpList inside an array
    const adpList = data[0].adpList[0];
    const parsedPlayerADP = PlayerADPSchema.parse(adpList);
    expect(parsedPlayerADP).toBeDefined();
  });

  it('should validate PlayerProjectionSchema and TeamDefenseProjectionSchema from getNFLProjections.md', () => {
    const data = readApiDoc('getNFLProjections.md');
    // The structure is an object with playerProjections and teamDefenseProjections inside an array
    const playerProjection = data[0].playerProjections[Object.keys(data[0].playerProjections)[0]];
    const parsedPlayerProjection = PlayerProjectionSchema.parse(playerProjection);
    expect(parsedPlayerProjection).toBeDefined();

    const teamDefenseProjection = data[0].teamDefenseProjections[Object.keys(data[0].teamDefenseProjections)[0]];
    const parsedTeamDefenseProjection = TeamDefenseProjectionSchema.parse(teamDefenseProjection);
    expect(parsedTeamDefenseProjection).toBeDefined();
  });

  it('should validate GameOddsSchema from getNFLBettingOdds.md', () => {
    const data = readApiDoc('getNFLBettingOdds.md');
    // The structure is an object with game odds inside an array
    const firstGameId = Object.keys(data[0])[0];
    const gameOdds = data[0][firstGameId];
    const parsedGameOdds = GameOddsSchema.parse(gameOdds);
    expect(parsedGameOdds).toBeDefined();
  });

  it('should validate NewsArticleSchema from getNFLNews.md', () => {
    const data = readApiDoc('getNFLNews.md');
    // NewsArticleSchema is an empty array
    const parsedNewsArticle = NewsArticleSchema.parse(data[0]);
    expect(parsedNewsArticle).toBeDefined();
    expect(parsedNewsArticle).toEqual([]);
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
    // The structure is an array of depth charts, each being an object, within an array
    const depthChart = data[0][0];
    const parsedDepthChart = DepthChartSchema.parse(depthChart);
    expect(parsedDepthChart).toBeDefined();
  });
});
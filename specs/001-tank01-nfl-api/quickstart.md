# Quickstart Guide: Tank01 NFL Client

**Feature**: Tank01 NFL API Client  
**Date**: 2025-11-20  
**Purpose**: Get developers up and running quickly with the Tank01 NFL client

## Prerequisites

- Node.js 18+ (LTS)
- TypeScript 5.x (if using TypeScript)
- Tank01 API key from RapidAPI

## Installation

```bash
npm install tank01-nfl-client
```

Or with yarn:

```bash
yarn add tank01-nfl-client
```

## Get Your API Key

1. Visit [RapidAPI Tank01 NFL API](https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl/)
2. Subscribe to a plan (free tier available)
3. Copy your API key from the dashboard

## Setup

### Environment Variable (Recommended)

```bash
export TANK01_API_KEY=your_api_key_here
```

Or add to your `.env` file:

```
TANK01_API_KEY=your_api_key_here
```

### Programmatic Configuration

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client({
  apiKey: "your_api_key_here",
});
```

## Basic Usage Examples

### Example 1: Get All NFL Teams

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getTeams() {
  try {
    const teams = await client.teams.getTeams();
    console.log(`Found ${teams.length} NFL teams:`);
    teams.forEach((team) => {
      console.log(`- ${team.teamName} (${team.teamAbv})`);
    });
  } catch (error) {
    console.error("Error fetching teams:", error.message);
  }
}

getTeams();
```

### Example 2: Get Player Information

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getPlayerInfo(playerID: string) {
  try {
    const player = await client.players.getPlayer(playerID);
    console.log(`Player: ${player.longName}`);
    console.log(`Position: ${player.pos}`);
    console.log(`Team: ${player.team}`);
    console.log(`Jersey: #${player.jerseyNum}`);
  } catch (error) {
    if (error instanceof Tank01NotFoundError) {
      console.error("Player not found");
    } else {
      console.error("Error:", error.message);
    }
  }
}

getPlayerInfo("4039329"); // Patrick Mahomes
```

### Example 3: Get Weekly Schedule

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getWeekSchedule() {
  try {
    const schedule = await client.games.getWeeklySchedule({
      season: "2024",
      week: 10,
      seasonType: "reg",
    });

    console.log(`Week ${schedule.week} Schedule:`);
    schedule.games.forEach((game) => {
      console.log(`${game.awayTeam} @ ${game.homeTeam} - ${game.gameDate}`);
      if (game.gameStatus === "Final") {
        console.log(`  Final Score: ${game.awayScore} - ${game.homeScore}`);
      }
    });
  } catch (error) {
    console.error("Error fetching schedule:", error.message);
  }
}

getWeekSchedule();
```

### Example 4: Get Player Season Statistics

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getPlayerStats(playerID: string, season: string) {
  try {
    const stats = await client.players.getPlayerStats(playerID, { season });

    console.log(`Season ${season} Stats:`);
    if (stats.passYards) {
      console.log(
        `Passing: ${stats.passCompletions}/${stats.passAttempts}, ${stats.passYards} yards, ${stats.passTD} TDs`
      );
    }
    if (stats.rushYards) {
      console.log(
        `Rushing: ${stats.rushAttempts} attempts, ${stats.rushYards} yards, ${stats.rushTD} TDs`
      );
    }
    if (stats.recYards) {
      console.log(
        `Receiving: ${stats.receptions} rec, ${stats.recYards} yards, ${stats.recTD} TDs`
      );
    }
  } catch (error) {
    console.error("Error fetching stats:", error.message);
  }
}

getPlayerStats("4039329", "2024");
```

### Example 5: Get Live Game Scores

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getLiveScores() {
  try {
    const liveGames = await client.live.getScoreboard();

    if (liveGames.length === 0) {
      console.log("No games currently in progress");
      return;
    }

    console.log("Live Games:");
    liveGames.forEach((game) => {
      console.log(`\n${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`Score: ${game.awayScore} - ${game.homeScore}`);
      console.log(`Q${game.currentQuarter} - ${game.gameClock}`);
      if (game.possession) {
        console.log(`Possession: ${game.possession}`);
      }
    });
  } catch (error) {
    console.error("Error fetching live scores:", error.message);
  }
}

// Poll live scores every 30 seconds
setInterval(getLiveScores, 30000);
getLiveScores();
```

### Example 6: Get Team Roster with Stats

```typescript
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client();

async function getTeamRoster(teamID: string) {
  try {
    const roster = await client.teams.getTeamRoster(teamID, {
      season: "2024",
      getStats: true,
    });

    console.log(`${teamID} Roster (${roster.length} players):`);

    // Group by position
    const byPosition = roster.reduce((acc, player) => {
      if (!acc[player.pos]) acc[player.pos] = [];
      acc[player.pos].push(player);
      return acc;
    }, {} as Record<string, typeof roster>);

    Object.entries(byPosition).forEach(([position, players]) => {
      console.log(`\n${position}:`);
      players.forEach((player) => {
        console.log(`  #${player.jerseyNum} ${player.longName}`);
      });
    });
  } catch (error) {
    console.error("Error fetching roster:", error.message);
  }
}

getTeamRoster("KC");
```

## Advanced Configuration

### Custom Timeout and Retries

```typescript
const client = new Tank01Client({
  apiKey: process.env.TANK01_API_KEY,
  timeout: 45000, // 45 second timeout
  maxRetries: 5, // Retry up to 5 times
  debug: true, // Enable debug logging
});
```

### Error Handling Best Practices

```typescript
import {
  Tank01Client,
  Tank01AuthenticationError,
  Tank01NotFoundError,
  Tank01RateLimitError,
  Tank01ValidationError,
  Tank01NetworkError,
} from "tank01-nfl-client";

const client = new Tank01Client();

async function robustFetch() {
  try {
    const teams = await client.teams.getTeams();
    return teams;
  } catch (error) {
    if (error instanceof Tank01AuthenticationError) {
      console.error("Invalid API key. Please check your credentials.");
    } else if (error instanceof Tank01RateLimitError) {
      console.error("Rate limit exceeded. Please wait before retrying.");
    } else if (error instanceof Tank01NotFoundError) {
      console.error("Resource not found.");
    } else if (error instanceof Tank01ValidationError) {
      console.error("API response validation failed:", error.message);
    } else if (error instanceof Tank01NetworkError) {
      console.error("Network error. Check your connection.");
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}
```

## TypeScript Support

The client is fully typed. Import types for autocomplete and type checking:

```typescript
import {
  Tank01Client,
  Team,
  Player,
  Game,
  PlayerStatistics,
  LiveGameData,
  ClientConfiguration,
} from "tank01-nfl-client";

const client: Tank01Client = new Tank01Client();

async function example() {
  const teams: Team[] = await client.teams.getTeams();
  const player: Player = await client.players.getPlayer("4039329");
  const schedule: Schedule = await client.games.getWeeklySchedule({
    season: "2024",
    week: 1,
  });
}
```

## Common Patterns

### Fetching Multiple Players in Parallel

```typescript
const playerIDs = ["4039329", "3139477", "3116593"];

const players = await Promise.all(
  playerIDs.map((id) => client.players.getPlayer(id))
);

players.forEach((player) => {
  console.log(`${player.longName} - ${player.team}`);
});
```

### Building a Fantasy Football Helper

```typescript
async function getFantasyProjections(week: number) {
  const projections = await client.stats.getProjections({
    week,
    season: "2024",
    position: "QB",
  });

  // Sort by projected points (example calculation)
  const sorted = Array.from(projections.entries())
    .map(([playerID, stats]) => ({
      playerID,
      projectedPoints:
        (stats.passYards || 0) * 0.04 +
        (stats.passTD || 0) * 4 +
        (stats.rushYards || 0) * 0.1,
    }))
    .sort((a, b) => b.projectedPoints - a.projectedPoints);

  return sorted;
}
```

### Tracking Live Game Updates

```typescript
class LiveGameTracker {
  private client: Tank01Client;
  private intervalID: NodeJS.Timeout | null = null;

  constructor() {
    this.client = new Tank01Client();
  }

  start(gameID: string, callback: (data: LiveGameData) => void) {
    this.intervalID = setInterval(async () => {
      try {
        const liveData = await this.client.live.getLiveGame(gameID);
        callback(liveData);
      } catch (error) {
        console.error("Failed to fetch live data:", error.message);
      }
    }, 30000); // Update every 30 seconds
  }

  stop() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }
}

// Usage
const tracker = new LiveGameTracker();
tracker.start("20241110_KC@BUF", (data) => {
  console.log(`Q${data.currentQuarter} - ${data.gameClock}`);
  console.log(`Score: ${data.awayScore} - ${data.homeScore}`);
});

// Stop tracking after game ends
setTimeout(() => tracker.stop(), 3 * 60 * 60 * 1000); // 3 hours
```

## Testing Your Integration

### Mock Client for Unit Tests

```typescript
// Create a mock client for testing
const mockClient = {
  teams: {
    getTeams: jest
      .fn()
      .mockResolvedValue([
        { teamID: "KC", teamName: "Kansas City Chiefs", teamAbv: "KC" },
      ]),
  },
  players: {
    getPlayer: jest.fn().mockResolvedValue({
      playerID: "4039329",
      longName: "Patrick Mahomes",
      pos: "QB",
      team: "KC",
    }),
  },
} as unknown as Tank01Client;

// Use in tests
test("fetches teams", async () => {
  const teams = await mockClient.teams.getTeams();
  expect(teams).toHaveLength(1);
  expect(teams[0].teamAbv).toBe("KC");
});
```

## Performance Tips

1. **Reuse Client Instance**: Create one client instance and reuse it
2. **Batch Requests**: Use `Promise.all()` for parallel requests
3. **Cache Results**: Implement your own caching for frequently accessed data
4. **Error Recovery**: Implement exponential backoff for your retry logic
5. **Connection Pooling**: The client automatically reuses HTTP connections

## Common Issues

### "Authentication Error"

- Check that your API key is correct
- Verify the key is set in environment or config
- Ensure you have an active RapidAPI subscription

### "Rate Limit Exceeded"

- Wait before making more requests
- Consider upgrading your RapidAPI plan
- Implement request throttling in your application

### "Validation Error"

- This indicates the API response didn't match expected schema
- May occur if Tank01 API changes
- Report the issue with response details

## Next Steps

- Read the [API Contract](./contracts/api-contract.md) for complete method documentation
- Review [Data Models](./data-model.md) for entity structures
- Check [Research](./research.md) for technology decisions
- Explore the full feature implementation plan in [plan.md](./plan.md)

## Need Help?

- Check the GitHub issues for known problems
- Review the API documentation at RapidAPI
- Submit bug reports with reproducible examples
- Include error messages and response payloads when reporting issues

## License

ISC

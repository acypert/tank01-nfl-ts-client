Note that with the client, I want all endpoints to be available on `client.{method}`. I don't want to have to reference the specific sub-clients (players, teams, etc.). I DO still want the project organized the same way though. 

## Teams:
/getNFLTeams
  - sortBy?: can be teamID, division, conference, or league. Default is teamID
  - rosters?: boolean
  - schedules?: boolean
  - topPerformers?: boolean, topPerformers=true to retrieve the best player in each category for each team
  - teamStats?: boolean, teamStats=true to retrieve Team Level/season long statistics for each team.
  - teamStatsSeason?: number, YYYY. Season year: 2023 is for the 2022-2023 season. Having a year in here will pull back the team stats associated with that season, if teamStats is true. This only goes as far back as the 2022 season (2021-2022). If left blank, this will always pull back the current season. Current season starts the first day that games are played.
  - standingsSeason?: number, YYYY. Enter season year (format YYYY) to retrieve the standings from that season. Works for season 2022 forward. Season 2022 is the NFL season that started in 2022 and ended in 2023. If left blank, default is current season.
/getNFLTeamRoster
  - teamID?: number
  - teamAbv?: string. 2-3 letters, all caps
  - archiveDate?: string. Unsure, but likely YYYYMMDD
  - getStats?: boolean. Does not work with historical roster call.
  - fantasyPoints?: boolean. will return season long fantasy points if set to true. getStats must be true, and the fantasyPointsDefault map will be entered within the stats element.
/getNFLDepthCharts: **Endpoint previously missed** No parameters


## Players:
/getNFLPlayerList: There are no parameters for this endpoint. Returns 4,500+ records. Use with caution.
/getNFLPlayerInfo: one of playerName or playerID are required
  - playerName?: string. snake_case
  - playerID?: number.
  - getStats: boolean. getStats=true will bring back each current season stats for the returned players
/getNFLPlayerStats: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLADP: **Endpoint previously missed**
  - adpType: Requred. Can be: halfPPR, PPR, standard, bestBall, IDP, superFlex
  - adpDate?: Optional. Date needs to be in format YYYYMMDD. Goes back as far as 20240416
  - pos?: Optional. Can be one of QB, RB, WR, TE, DST, K, LB, DE, S, CB, DT
  - filterOut?: If you would like to filter out a position from the ADP, then add that position here. Valid positions are QB, RB, WR, TE, DST, K, LB, DE, S, CB, DT. If you would like to filter out multiple positions, then simply concatenate them. For example, filtering out QB and RB would look like QBRB.

## Games:
/getNFLGamesForWeek (you already provided this one ✓)
  - week: string. Either put a number 1 through 18 or 'all'
  - seasonType?: string. can be: reg, post, pre, or all. If blank, \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"reg\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" is assumed
  - season?: number. YYYY
/getNFLGameInfo
  - gameID: string. Formatted like: 20241020_CAR@WSH (YYYYMMDD_Away@Home)
/getNFLTeamSchedule: Need a valid teamID or teamAbv. Try the get NFL Teams call to find correct attributes. Season requested might also be unavailable
  - teamID?: number
  - teamAbv?: string. 
  - season?: number. YYYY
/getNFLScoresOnly: Leaving all params empty will yield scores for the current day.
  - gameDate?: string. YYYYMMDD
  - gameID?: string.
  - topPerformers?: boolean. true Will give season top performers if game hasn't started yet. Will give game top performers if game has started.
  - gameWeek?: number. This will be a number 1 through 18. Use this instead of gameDate to get games for the specific week instead of a date. Using this will default the season to current season and the seasonType to \\\\\\\"regular\\\\\\\" for regular season.
  - season?: number
  - seasonType?: string.
/getNFLGamesForDate **missed**
  - gameDate: string. YYYYMMDD

## Live:
/getNFLGamesLive: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLBoxScore
  - gameID?: string. Formatted like: 20241020_CAR@WSH (YYYYMMDD_Away@Home)
  - playByPlay?: boolean
  - fantasyPoints?: boolean
/getNFLPlayByPlay: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**


## Stats:
/getNFLTeamStats: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLPlayerAdvancedStats: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLTeamRankings: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLPlayerProjections: **This isn't a real endpoint. This should be removed from the spec, plan, tasks, and implementation**
/getNFLGamesForPlayer **missed**
  - playerID?: number
  - teamID?: number
  - gameID?: string
  - itemFormat?: string. Determines how the results are returned. can be list or map. default is map.
  - numberOfGames?: number. limit the number of games returned with whatever number you enter here. Will return the most recent.
  - fantasyPoints: boolean. Our client API should default this param to false whenever it appears as an available param.

## Odds
/getNFLBettingOdds **previously missed** Note that either gameDate or gameID is required
  - gameDate?: string. YYYYMMDD
  - gameID?: string. Formatted like: 20241020_CAR@WSH (YYYYMMDD_Away@Home)
  - itemFormat?: string. this can be 'list' or 'map' Defaults to map. Gives games and lines in list format instead of map/dictionary format.
  - impliedTotals?: boolean. true will return an element called impliedTotals which will calculate what each team should score based off of each sportsbook's over under and the spread. This will return an empty map if the spread or over under is currently unavailable.
  - playerProps: boolean. playerProps = true to return player props
  - playerID?: number. filter props by playerID. requires gameDate to be populated.

## News
/getNFLNews **missed**
  - playerID?: playerID as can be found in many of the endpoints
  - teamID?: number
  - teamAbv?: string
  - topNews?: boolean
  - fantasyNews?: boolean
  - recentNews?: boolean
  - maxItems?: number

## Fantasy
/getNFLProjections
  - week?: string. This can be a week 1 - 18 (regular season) or week 19-22 (postseason) or season for full season projections. This does not work with the playerID or teamID parameters. If those parameters are also included, this will be ignored.
  - playerID?: number. To return weekly projections filtered by playerID, enter playerID. This parameter will override week and teamID parameter.
  - teamID?: number. To return weekly projections filtered by a team, enter teamID. Leave the playerID parameter empty in order to make this work. This will override the week parameter.
  - archiveSeason?: number, YYYY. Ro pull back previous seasons, enter the team year. Does not work with playerID or teamID
  - itemFormat?: string. 'map' | 'list'. Answers the question 'would you like the projections to be in a list, or be formatted in a map where the playerID or teamID is the key.' Default is map.
/getNFLDFS **missed**
  - date: string. 'YYYYMMDD'
  - includeTeamDefense: boolean.

## Info
/getNFLCurrentInfo
  - date?: string. Not required. Leave blank for current info. Date should be formatted YYYYMMDD.
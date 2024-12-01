const nflEndpoints = {
    teamProfiles: 'https://api.sportsdata.io/v3/nfl/scores/json/Teams',
    last5Games: (season, teamID, numOfGames) =>
        `https://api.sportsdata.io/v3/nfl/scores/json/TeamGameStatsBySeason/${season}/${teamID}/${numOfGames}`,
    injuries: (teamKey) =>
        `https://api.sportsdata.io/v3/nfl/scores/json/Players/${teamKey}`,
    games: (season) => `https://api.sportsdata.io/v3/nfl/scores/json/SchedulesBasic/${season}`,
    bakerProjections: (gameID) =>
        `https://baker-api.sportsdata.io/baker/v2/nfl/projections/games/${gameID}`
}

const nbaEndpoints = {
    teamProfiles: 'https://api.sportsdata.io/v3/nba/scores/json/teams',
    last5Games: (season, teamID, numOfGames) =>
        `https://api.sportsdata.io/v3/nba/scores/json/TeamGameStatsBySeason/${season}/${teamID}/${numOfGames}`,
    injuries: (teamKey) =>
        `https://api.sportsdata.io/v3/nba/scores/json/Players/${teamKey}`,
    games: (season) => `https://api.sportsdata.io/v3/nba/scores/json/SchedulesBasic/${season}`,
    bakerProjections: (gameID) =>
        `https://baker-api.sportsdata.io/baker/v2/nba/projections/games/${gameID}`
}

const mlbEndpoints = {
    teamProfiles: 'https://api.sportsdata.io/v3/mlb/scores/json/teams',
    last5Games: (season, teamID, numOfGames) =>
        `https://api.sportsdata.io/v3/mlb/scores/json/TeamGameStatsBySeason/${season}/${teamID}/${numOfGames}`,
    injuries: (teamKey) =>
        `https://api.sportsdata.io/v3/mlb/scores/json/Players/${teamKey}`,
    games: (season) => `https://api.sportsdata.io/v3/mlb/scores/json/SchedulesBasic/${season}`,
    bakerProjections: (gameID) =>
        `https://baker-api.sportsdata.io/baker/v2/mlb/projections/games/${gameID}`
}

module.exports = {
    nflEndpoints,
    nbaEndpoints,
    mlbEndpoints
}
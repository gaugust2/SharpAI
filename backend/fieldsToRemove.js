const gameFieldsToRemove = [
    "StatID",
    "TeamID",
    "SeasonType",
    "Season",
    "GlobalTeamID",
    "GameID",
    "OpponentID",
    "Day",
    "DateTime",
    "HomeOrAway",
    "IsGameOver",
    "GlobalGameID",
    "GlobalOpponentID",
    "Updated",
    "Games",
    "OffensiveReboundsPercentage",
    "DefensiveReboundsPercentage",
    "TotalReboundsPercentage",
    "PlayerEfficiencyRating",
    "AssistsPercentage",
    "StealsPercentage",
    "BlocksPercentage",
    "TurnOversPercentage",
    "UsageRatePercentage",
    "FantasyPointsFanDuel",
    "FantasyPointsDraftKings",
    "FantasyPointsYahoo",
    "DoubleDoubles",
    "TripleDoubles",
    "FantasyPointsFantasyDraft",
    "IsClosed",
    "LineupConfirmed",
    "LineupStatus",
    "Stadium",
    "PlayingSurface",
    "Temperature",
    "Humidity",
    "WindSpeed",
    "OverUnder",
    "PointSpread",
    "TeamGameID",
    "ScoreID",
    "OpponentScoreQuarter1",
    "OpponentScoreQuarter2",
    "OpponentScoreQuarter3",
    "OpponentScoreQuarter4",
    "OpponentScoreOvertime",
    "OpponentTimeOfPossessionMinutes",
    "OpponentTimeOfPossessionSeconds",
    "OpponentTimeOfPossession",
    "OpponentFirstDowns",
    "OpponentFirstDownsByRushing",
    "OpponentFirstDownsByPassing",
    "OpponentFirstDownsByPenalty",
    "OpponentOffensivePlays",
    "OpponentOffensiveYards",
    "OpponentOffensiveYardsPerPlay",
    "OpponentTouchdowns",
    "OpponentRushingAttempts",
    "OpponentRushingYards",
    "OpponentRushingYardsPerAttempt",
    "OpponentRushingTouchdowns",
    "OpponentPassingAttempts",
    "OpponentPassingCompletions",
    "OpponentPassingYards",
    "OpponentPassingTouchdowns",
    "OpponentPassingInterceptions",
    "OpponentPassingYardsPerAttempt",
    "OpponentPassingYardsPerCompletion",
    "OpponentCompletionPercentage",
    "OpponentPasserRating",
    "OpponentThirdDownAttempts",
    "OpponentThirdDownConversions",
    "OpponentThirdDownPercentage",
    "OpponentFourthDownAttempts",
    "OpponentFourthDownConversions",
    "OpponentFourthDownPercentage",
    "OpponentRedZoneAttempts",
    "OpponentRedZoneConversions",
    "OpponentGoalToGoAttempts",
    "OpponentGoalToGoConversions",
    "OpponentReturnYards",
    "OpponentPenalties",
    "OpponentPenaltyYards",
    "OpponentFumbles",
    "OpponentFumblesLost",
    "OpponentTimesSacked",
    "OpponentTimesSackedYards",
    "OpponentQuarterbackHits",
    "OpponentTacklesForLoss",
    "OpponentSafeties",
    "OpponentPunts",
    "OpponentPuntYards",
    "OpponentPuntAverage",
    "OpponentGiveaways",
    "OpponentTakeaways",
    "OpponentTurnoverDifferential",
    "OpponentRedZonePercentage",
    "OpponentGoalToGoPercentage",
    "OpponentQuarterbackHitsDifferential",
    "OpponentTacklesForLossDifferential",
    "OpponentQuarterbackSacksDifferential",
    "OpponentTacklesForLossPercentage",
    "OpponentQuarterbackHitsPercentage",
    "OpponentTimesSackedPercentage",
    "OpponentKickoffs",
    "OpponentKickoffsInEndZone",
    "OpponentKickoffTouchbacks",
    "OpponentPuntsHadBlocked",
    "OpponentPuntNetAverage",
    "OpponentExtraPointKickingAttempts",
    "OpponentExtraPointKickingConversions",
    "OpponentExtraPointsHadBlocked",
    "OpponentExtraPointPassingAttempts",
    "OpponentExtraPointPassingConversions",
    "OpponentExtraPointRushingAttempts",
    "OpponentExtraPointRushingConversions",
    "OpponentFieldGoalAttempts",
    "OpponentFieldGoalsMade",
    "OpponentFieldGoalsHadBlocked",
    "OpponentPuntReturns",
    "OpponentPuntReturnYards",
    "OpponentKickReturns",
    "OpponentKickReturnYards",
    "OpponentInterceptionReturns",
    "OpponentInterceptionReturnYards",
    "OpponentSoloTackles",
    "OpponentAssistedTackles",
    "OpponentSacks",
    "OpponentSackYards",
    "OpponentPassesDefended",
    "OpponentFumblesForced",
    "OpponentFumblesRecovered",
    "OpponentFumbleReturnYards",
    "OpponentFumbleReturnTouchdowns",
    "OpponentInterceptionReturnTouchdowns",
    "OpponentBlockedKicks",
    "OpponentPuntReturnTouchdowns",
    "OpponentPuntReturnLong",
    "OpponentKickReturnTouchdowns",
    "OpponentKickReturnLong",
    "OpponentBlockedKickReturnYards",
    "OpponentBlockedKickReturnTouchdowns",
    "OpponentFieldGoalReturnYards",
    "OpponentFieldGoalReturnTouchdowns",
    "OpponentPuntNetYards",
];

const playerFieldsToRemove = [
    "PlayerID", 
    "SportsDataID", 
    "Status", 
    "TeamID", 
    "Team", 
    "Jersey", 
    "BirthDate", 
    "BirthCity", 
    "BirthState", 
    "BirthCountry", 
    "HighSchool", 
    "College", 
    "Salary", 
    "PhotoUrl", 
    "SportRadarPlayerID", 
    "RotoworldPlayerID", 
    "RotoWirePlayerID", 
    "FantasyAlarmPlayerID", 
    "StatsPlayerID", 
    "SportsDirectPlayerID", 
    "XmlTeamPlayerID", 
    "FanDuelPlayerID", 
    "DraftKingsPlayerID", 
    "YahooPlayerID", 
    "FanDuelName", 
    "DraftKingsName", 
    "YahooName", 
    "DepthChartPosition", 
    "DepthChartOrder", 
    "GlobalTeamID", 
    "FantasyDraftName", 
    "FantasyDraftPlayerID", 
    "UsaTodayPlayerID", 
    "UsaTodayHeadshotUrl", 
    "UsaTodayHeadshotNoBackgroundUrl", 
    "UsaTodayHeadshotUpdated", 
    "UsaTodayHeadshotNoBackgroundUpdated", 
    "NbaDotComPlayerID"
];

const selectedGameFieldsToRemove = [
    "day",
    "date",
    "over_under",
    "season_name",
    "point_spread",
    "season_number",
    "sportsdata_id",
    "game_projections"
]


module.exports = { gameFieldsToRemove, playerFieldsToRemove, selectedGameFieldsToRemove }
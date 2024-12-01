const axios = require('axios')
const config = require('./config')
const { gameFieldsToRemove, playerFieldsToRemove, selectedGameFieldsToRemove } = require('./fieldsToRemove')

const { nflEndpoints,
    nbaEndpoints,
    mlbEndpoints } = require('./apiEndpoints')

//Below are acceptable date formats from the user. Anything else will result in an error
//October 22 2024
//10/22/2024
//10-22-2024
//2024/10/22

//This file uses SportsDataIO's APIs. The APIs will give us data about the two teams the user is betting on.
//We can process and feed this data into an LLM to create an analysis.
//This function is used in server.js under the /betslip route. It is then directly used in the getAnalysis function from openaiservice.js

async function sportsDataIOController(betslip){
    try {
        const { league, selectedTeam, opposingTeam, date } = betslip;
        let endpoints, season;

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0 = January, 11 = December

        switch (league) {
            case 'NBA':
                endpoints = nbaEndpoints
                // NBA season starts in October (Month 9) and runs into the next year
                season = currentMonth >= 9 ? currentYear + 1 : currentYear;
                break
            case 'NFL':
                endpoints = nflEndpoints
                // NFL season starts in September (Month 8) and ends in February of the next year
                season = currentMonth >= 8 ? currentYear : currentYear - 1;
                break
            case 'MLB':
                endpoints = mlbEndpoints
                // MLB season starts in April (Month 3) and ends in October (Month 9)
                season = currentMonth >= 3 && currentMonth <= 9 ? currentYear : currentYear + 1;
                break
            default:
                console.log(`Unknown League ${league}`)
                throw new Error(`Unknown League: ${league}`)
        }






        const teamProfiles = await axios.get(endpoints.teamProfiles, {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        const selectedTeamInfo = teamProfiles.data.find(t => t.City === betslip.selectedTeam.city && t.Name === betslip.selectedTeam.name);
        const opposingTeamInfo = teamProfiles.data.find(t => t.City === betslip.opposingTeam.city && t.Name === betslip.opposingTeam.name);
        //Important: selectedTeamInfo and opposingTeamInfo have TeamID, and Key

        //These checks are to make sure the inputted teams were found
        if (!selectedTeamInfo) {
            throw new Error(`Selected team not found: ${betslip.selectedTeam.city} ${betslip.selectedTeam.name}`);
        } if (!opposingTeamInfo) {
            throw new Error(`Opposing team not found: ${betslip.opposingTeam.city} ${betslip.opposingTeam.name}`);
        }





        const schedule = await axios.get(endpoints.games(season), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        //All the conditionals are to check and make sure the game indeed exists
        const gameInfo = schedule.data.find(game => new Date(game.Day).toDateString() === new Date(betslip.date).toDateString() 
        && (selectedTeamInfo.Key === game.AwayTeam || selectedTeamInfo.Key === game.HomeTeam) 
        && (opposingTeamInfo.Key === game.AwayTeam || opposingTeamInfo.Key === game.HomeTeam))
        //Important, gameInfo object has GameID

        if (!gameInfo) {
            throw new Error(`Game not found: ${betslip.selectedTeam.name} vs ${betslip.opposingTeam.name}, ${betslip.date}`);
        }

        const gameID = gameInfo.GameID

        





        let selectedTeamLast5Games = await axios.get(endpoints.last5Games(season, selectedTeamInfo.TeamID, 5), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        let opposingTeamLast5Games = await axios.get(endpoints.last5Games(season, opposingTeamInfo.TeamID, 5), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        selectedTeamLast5Games.data.forEach(game => {
            gameFieldsToRemove.forEach(field => delete game[field]);
        });

        opposingTeamLast5Games.data.forEach(game => {
            gameFieldsToRemove.forEach(field => delete game[field]);
        });
        //selectedTeamLast5Games and opposingTeamLast5Games will be used for analysis on both teams' last 5 games


        


        const selectedTeamRoster = await axios.get(endpoints.injuries(selectedTeamInfo.Key), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        const opposingTeamRoster = await axios.get(endpoints.injuries(opposingTeamInfo.Key), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        const selectedTeamInjuries = selectedTeamRoster.data.filter(player => player.InjuryStatus !== null);
        const opposingTeamInjuries = opposingTeamRoster.data.filter(player => player.InjuryStatus !== null);

        selectedTeamInjuries.forEach(player => {
            playerFieldsToRemove.forEach(field => delete player[field]);
        });

        opposingTeamInjuries.forEach(player => {
            playerFieldsToRemove.forEach(field => delete player[field]);
        });
        //selectedTeamInjuries and opposingTeamInjuries will be used for analysis on which team is shorthanded






        const projections = await axios.get(endpoints.bakerProjections(gameID), {
            headers: {
                'Ocp-Apim-Subscription-Key': config.SPORTS_DATA_API_KEY
            }
        });

        selectedGameFieldsToRemove.forEach(field => delete projections.data[field]);
        //The BAKER game projections will inform the analysis of the expected winner

        return [selectedTeamLast5Games.data, opposingTeamLast5Games.data, selectedTeamInjuries, opposingTeamInjuries, projections.data]

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = { sportsDataIOController }
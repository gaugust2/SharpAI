const express = require('express')
const app = express();
app.use(express.json());
const axios = require('axios')
const config = require('./config')
const { getAnalysis } = require('./openaiService');
const { sportsDataIOController } = require('./sportsDataIOService')

app.get('/', async (req, res) => {
  res.send('Hello World!')
});

  
app.post('/betslip', async (req, res) => {
    try {
        const betslip = req.body;
        /* Bet slip should have the following structure:
        {
            "league": "NBA",
            "selectedTeam": {
                "city": "Dallas",
                "name": "Mavericks"
            },
            "opposingTeam": {
                "city": "Utah",
                "name": "Jazz"
            },
            "date": "November 30 2024"
        }

        Below are acceptable date formats from the user. Anything else will result in an error.
        October 22 2024
        10/22/2024
        10-22-2024
        2024/10/22
        */
        
        const externalData = await sportsDataIOController(betslip);
        //externalData is an array of the following: [selectedTeamLast5Games, opposingTeamLast5Games, selectedTeamInjuriesList, opposingTeamInjuriesList, projections]
        //They are all JSON objects that we will use to inform our analysis
        const analysis = await getAnalysis(externalData);
        
        res.send(externalData)
        //res.json({ analysis });
    } catch (error) {
        console.error(error.message);
        res.status(404).send(error.message);
    }
});

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

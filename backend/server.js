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
  
      // Validate the input structure
      if (!betslip.league || !betslip.selectedTeam || !betslip.opposingTeam || !betslip.date) {
        throw new Error('Invalid betslip structure.');
      }
  
      const externalData = await sportsDataIOController(betslip);
      const analysis = await getAnalysis(externalData);
  
      res.json({ analysis });
    } catch (error) {
      console.error(error.message);
      res.status(404).send(error.message);
    }
  });

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

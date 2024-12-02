const express = require('express')
const app = express();
app.use(express.json());
const axios = require('axios')
const config = require('./config')
const { getAnalysis } = require('./openaiService');
const { sportsDataIOController } = require('./sportsDataIOService')
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

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
        
        const analysis = await getAnalysis(betslip, externalData);
        /*analysis is an object with the following structure:
        {
            "selectedTeamLast5Games": "",
            "opposingTeamLast5Games": "",
            "selectedTeamInjuries": "",
            "opposingTeamInjuries": "",
            "projections": "",
            "conclusion": ""
        }
        
        These sections are not final. We can add, remove, or modify these as needed.*/

        res.json(analysis)
    } catch (error) {
        console.error(error.message);
        res.status(404).send(error.message);
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.log(err));
  
  // User Schema
  const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bettingBudget: { type: Number, required: true },
  });
  
  const User = mongoose.model('User', userSchema, 'Users');
  
  // Routes
  app.post('/signup', async (req, res) => {
    const { firstName, email, password, bettingBudget } = req.body;
  
    try {
      // check user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // create new user
      const newUser = new User({ firstName, email, password, bettingBudget });
      await newUser.save();
  
      // generate towken
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
        },
        JWT_SECRET,
        { expiresIn: '2h' } // 2hr expiry
      );
  
      
      res.status(201).json({
        message: 'User registered successfully!',
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // chdck email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // check pass
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
        },
        JWT_SECRET,
        { expiresIn: '2h' } // 2 hours expiry
      );
  
      //  login
      res.status(200).json({
        message: 'Login successful',
        token, // Send token 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });

  //should use later for better secuirty
  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied, token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

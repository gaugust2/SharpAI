const express = require("express");
const app = express();
const axios = require("axios");
const config = require("./config");
const { getAnalysis } = require("./openaiService");
const { sportsDataIOController } = require("./sportsDataIOService");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Handle any unknown routes (React routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bettingBudget: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema, "Users");

// Routes
app.post("/signup", async (req, res) => {
  const { firstName, email, password, bettingBudget } = req.body;

  try {
    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
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
      { expiresIn: "2h" } // 2hr expiry
    );

    res.status(201).json({
      message: "User registered successfully!",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // chdck email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check pass
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
      JWT_SECRET,
      { expiresIn: "2h" } // 2 hours expiry
    );

    //  login
    res.status(200).json({
      message: "Login successful",
      token, // Send token
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/betslip", async (req, res) => {
  try {
    // Step 1: Extract token from the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer token"

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Step 2: Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET); // Ensure JWT_SECRET matches
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Step 3: Attach the decoded token payload to the request (optional)
    req.user = decoded;

    // Step 4: Validate incoming betslip data
    const { league, selectedTeam, opposingTeam, date } = req.body;
    if (!league || !selectedTeam || !opposingTeam || !date) {
      return res
        .status(400)
        .json({ message: "Missing required fields in betslip" });
    }

    if (
      !selectedTeam.city ||
      !selectedTeam.name ||
      !opposingTeam.city ||
      !opposingTeam.name
    ) {
      return res.status(400).json({
        message: "Selected team or opposing team is missing city or name.",
      });
    }

    console.log("Received betslip:", {
      league,
      selectedTeam,
      opposingTeam,
      date,
    });

    // Step 5: Call sportsDataIOController to process the betslip
    const externalData = await sportsDataIOController({
      league,
      selectedTeam,
      opposingTeam,
      date,
    });

    if (!Array.isArray(externalData) || externalData.length !== 5) {
      return res.status(500).json({
        message: "Expected externalData to be an array with 5 elements.",
      });
    }

    // Step 6: Perform analysis with the external data
    const analysis = await getAnalysis(
      { selectedTeam, opposingTeam },
      externalData
    );

    if (!analysis) {
      return res.status(500).json({ message: "Failed to generate analysis" });
    }

    console.log("Analysis generated:", analysis);

    // Step 7: Respond with the analysis result
    res.json({ analysis });
  } catch (error) {
    console.error("Error in /betslip:", error.message);
    res
      .status(500)
      .json({ message: `Failed to process betslip: ${error.message}` });
  }
});

//should use later for better secuirty
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

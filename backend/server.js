const express = require("express");
const app = express();
const axios = require("axios");
const config = require("./config");
const { getAnalysis } = require("./openaiService");
const { sportsDataIOController } = require("./sportsDataIOService");
const { authenticateToken } = require("./middleware")
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { strict } = require("assert");

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

//Message schema
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  timestamp: { type: Date, default: Date.now },
});

//Conversation Schema
const conversationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  analysis: { type: mongoose.Schema.Types.Mixed, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
  "Conversations"
);

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

app.post("/betslip", authenticateToken, async (req, res) => {
  try {
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

    // Step 7: Create new Conversation in MongoDB
    const newConversation = new Conversation({
      userID: req.user.id,
      analysis: analysis,
    });
    const conversationID = (await newConversation.save())._id.toString();

    console.log("Analysis generated:", analysis);

    // Step 8: Respond with the analysis result
    res.status(200).json({ conversationID, analysis });
  } catch (error) {
    console.error("Error in /betslip:", error.message);
    res
      .status(500)
      .json({ message: `Failed to process betslip: ${error.message}` });
  }
});

app.post("/chat", authenticateToken, async (req, res) => {
  try {

    res.json({ user: req.user });
  } catch (error) {
    console.error("Error in /chat:", error.message);
    res
      .status(500)
      .json({ message: `Failed to process betslip: ${error.message}` });
  }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

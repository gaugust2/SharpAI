const express = require("express");
const app = express();
const axios = require("axios");
const config = require("./config");
const { getAnalysis, getAIResponse } = require("./openaiService");
const { sportsDataIOController } = require("./sportsDataIOService");
const { authenticateToken } = require("./middleware");
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
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

//Conversation Schema
const conversationSchema = new mongoose.Schema({
  conversationName: { type: mongoose.Schema.Types.String, required: true },
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

const analysisToString = (analysis) => {
  const analysisString = Object.entries(analysis)
    .map(([key, value]) => `${key}: \n${value}`)
    .join("\n\n");

  return analysisString;
};

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
    // Step 1: Validate incoming betslip data
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

    // Step 2: Call sportsDataIOController to process the betslip
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

    // Step 3: Perform analysis with the external data
    const analysis = await getAnalysis(
      { selectedTeam, opposingTeam },
      externalData
    );

    if (!analysis) {
      return res.status(500).json({ message: "Failed to generate analysis" });
    }

    // Step 4: Create name for new conversation
    const title = await getAIResponse([
      {
        role: "system", 
        content: "Provide a 3-5 word conclusion based on the analysis provided."
      },
      {
        role: "assistant",
        content: analysisToString(analysis)
      }
    ], 0.9)

    // Step 5: Create new Conversation in MongoDB
    const newConversation = new Conversation({
      conversationName: `${title} - ${date}`,
      userID: req.user.id,
      analysis: analysis,
    });
    const conversationID = (await newConversation.save())._id.toString();

    console.log("Analysis generated:", analysis);

    // Step 6: Respond with the analysis result
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
    // Step 1: Check headers for conversation ID
    const conversationID = req.headers["conversation-id"];

    if(!conversationID) {
      return res.status(400).json({ error: "Header missing conversation-id"});
    }

    // Step 2: Validate incoming data
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ error: "Missing required fields in betslip" });
    }

    // Step 3: Store user's message in MongoDB
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationID,
      { $push: { messages: { role: "user", content: message } } },
      { new: true }
    );

    // Step 4: Prepare/process the data for OpenAI
    const analysisString = analysisToString(updatedConversation.analysis)

    const messages = [
      {
        role: "system",
        content:
          "You are an expert sports betting analysis assistant. Your task is to provide thorough and accurate analyses of sports betting opportunities, explaining the rationale behind your recommendations. When responding to user queries, you should reference your analysis and offer clear, data-driven insights.",
      },
      { role: "assistant", content: analysisString },
    ];

    updatedConversation.messages.slice(-4).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Step 5: Get OpenAI response
    const assistantMessage = await getAIResponse(messages);

    if (!assistantMessage) {
      return res.status(500).json({ message: "Assistant failed to respond." });
    }

    // Step 6: Store assistant's message in MongoDB
    await Conversation.findByIdAndUpdate(conversationID, {
      $push: { messages: { role: "assistant", content: assistantMessage } },
    });

    // Step 7: Respond with the assistant's message
    res.status(200).send(assistantMessage);
  } catch (error) {
    console.error("Error in /chat:", error.message);
    res
      .status(500)
      .json({ message: `Failed to process message: ${error.message}` });
  }
});

app.get("/conversationNames", authenticateToken, async (req, res) => {
  try {
    // Step 1: Query MongoDB for list of conversation names using userID
    const conversations = await Conversation.find({ userID: req.user.id }, "_id conversationName").exec()

    // Step 2: Respond with the list of the user's conversations
    res.json({ conversations })
  } catch (error) {
    console.error("Error in /conversationNames:", error.message);
    res
      .status(500)
      .json({ message: `Failed to return conversation names: ${error.message}` });
  }
})

app.get("/conversation", authenticateToken, async (req, res) => {
  try {
    // Step 1: Check headers for conversation ID
    const conversationID = req.headers["conversation-id"];

    if(!conversationID) {
      return res.status(400).json({ error: "Header missing conversation-id"});
    }

    // Step 2: Query MongoDB for full conversation
    const conversation = await Conversation.findById(conversationID, 'analysis messages').exec()

    // Step 3: Respond with the analysis and array of messages
    res.json({ conversation })
  } catch (error) {
    console.error("Error in /conversationNames:", error.message);
    res
      .status(500)
      .json({ message: `Failed to return conversation names: ${error.message}` });
  }
})

// This is a "Catch all route" - Handle any unknown routes (React routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

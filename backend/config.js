require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MONGODB_USER = process.env.DB_USER;
const MONGODB_PASSWORD = process.env.DB_PASSWORD;

const SPORTS_DATA_API_KEY = process.env.SPORTS_DATA_API_KEY;

module.exports = {
  OPENAI_API_KEY,
  MONGODB_USER,
  MONGODB_PASSWORD,
  SPORTS_DATA_API_KEY,
};

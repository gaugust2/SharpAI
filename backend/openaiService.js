const OpenAI = require("openai");
const config = require("./config");
const { z } = require('zod');
const { zodResponseFormat } = require("openai/helpers/zod");

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const schema = z.object({
  league: z.string(),
  selectedTeam: z.object({
    city: z.string(),
    name: z.string()
  }),
  opposingTeam: z.object({
    city: z.string(),
    name: z.string()
  }),
  date: z.string()
});

/*Analysis Sections:

Team 1: 
-Performance over the last 5 games
-Injury Report

Team 2:
-Performance over the last 5 games
-Injury Report

Projections

Recomended bet amount, risk

Conclusion - Unbiased, summary on everything, highlighting key points
*/

//This prompts object just contains the prompts used to create the analysis. It is open to change
const prompts = {
  last5GamesPrompt: (team, data) =>
    `Here are the stats of the last 5 games the ${team.city} ${
      team.name
    } have played from most to least recent. Analyze the stats and extract notable details and trends from their performance, whether positive or negative. Do not make any suggestions, comments, or hypotheticals. Provide the analysis in a 5-8 sentence paragraph.\n\n${JSON.stringify(
      data
    )}`,
  injuriesPrompt: (team, data) =>
    `Here is the list of players for the ${team.city} ${
      team.name
    } that will be out for the next game. Write a 5 sentence max report on this list.\n\n${JSON.stringify(
      data
    )}`,
  projectionsPrompt: (selectedTeam, opposingTeam, data) =>
    `Here are the BAKER projections for the upcoming ${selectedTeam.city} ${
      selectedTeam.name
    } vs ${opposingTeam.city} ${
      opposingTeam.name
    } game. Write a 5-8 sentence analysis on these projections, making sure to include the projected winner.\n\n${JSON.stringify(
      data
    )}`,
  conclusionPrompt: (selectedTeam, opposingTeam, concatenatedResponses) =>
    `Here are reports on the last 5 games and recent injuries of both teams in the upcoming ${selectedTeam.city} ${selectedTeam.name} vs ${opposingTeam.city} ${opposingTeam.name} game. Write a 5-8 sentence analysis on these reports.\n\n${concatenatedResponses}`,
};

async function getAnalysis(betslip, externalData) {
  try {
    const [
      selectedTeamLast5GamesRaw,
      opposingTeamLast5GamesRaw,
      selectedTeamInjuriesList,
      opposingTeamInjuriesList,
      projectionsRaw,
    ] = externalData;

    // Extract team names
    const selectedTeamName = betslip.selectedTeam;
    const opposingTeamName = betslip.opposingTeam;

    // Fetch AI responses based on the team names
    const selectedTeamLast5Games = await getAIResponse([{
      role: "system", 
      content: prompts.last5GamesPrompt(selectedTeamName, selectedTeamLast5GamesRaw)
    }]);
    const opposingTeamLast5Games = await getAIResponse([{
      role: "system", 
      content: prompts.last5GamesPrompt(opposingTeamName, opposingTeamLast5GamesRaw)
    }]);
    const selectedTeamInjuries = await getAIResponse([{
      role: "system",
      content: prompts.injuriesPrompt(selectedTeamName, selectedTeamInjuriesList)
    }]);
    const opposingTeamInjuries = await getAIResponse([{
      role: "system",
      content: prompts.injuriesPrompt(opposingTeamName, opposingTeamInjuriesList)
    }]);
    const projections = Object.keys(projectionsRaw).length === 0 
    ? "The BAKER projections were not found for this game. Please check later, as they may be available." 
    : await getAIResponse([{
      role: "system",
      content: prompts.projectionsPrompt(selectedTeamName, opposingTeamName, projectionsRaw)
    }]);

    // Concatenate all the responses to create a conclusion
    const concatenatedResponses = `${selectedTeamLast5Games}\n\n${opposingTeamLast5Games}\n\n${selectedTeamInjuries}\n\n${opposingTeamInjuries}\n\n${projections}`;
    const conclusion = await getAIResponse([{
      role: "system",
      content: prompts.conclusionPrompt(selectedTeamName, opposingTeamName, concatenatedResponses)
    }]);

    // Dynamically generate the object with team names in labels
    return {
      [`Summary of ${selectedTeamName.name} Last 5 Games`]: selectedTeamLast5Games,
      [`Summary of ${opposingTeamName.name} Last 5 Games`]: opposingTeamLast5Games,
      [`${selectedTeamName.name} Injury Report`]: selectedTeamInjuries,
      [`${opposingTeamName.name} Injury Report`]: opposingTeamInjuries,
      Projections: projections,
      Conclusion: conclusion,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate analysis:", error);
  }
}

async function getAIResponse(messages, temp = 0.4) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: messages,
    temperature: temp,
  }); //Temperature can be between 0-1. Higher values are better for creativity, lower values are better for following instructions.

  return completion.choices[0].message.content;
}

async function getAIStructuredResponse(base64Image) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify the features of the betslip. If a feature is unclear or does not exist, leave as blank. If there is a date, use MM-DD-YYYY format.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(schema, "new_schema"),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error sending image to OpenAI:", error);
  }
}

module.exports = {
  getAnalysis,
  getAIResponse,
  getAIStructuredResponse
};

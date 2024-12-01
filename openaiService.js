const OpenAI = require('openai');
const config = require('./config');

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
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

async function getAnalysis(externalData) {
    try {
        const [selectedTeamLast5Games, opposingTeamLast5Games, selectedTeamInjuriesList, opposingTeamInjuriesList, projections] = externalData //Destructuring the array, since we already know the structure
        
        

    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate analysis:', error);
    }
}

async function getAIResponse(object, prompt){
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            { role: "system", content: "You are a sports betting analyst." },
            {
                role: "user",
                content: `Analyze this betslip data: ${JSON.stringify(data)}`,
            },
        ],
    });

    return completion.choices[0].message.content;
}


module.exports = {
    getAnalysis
};

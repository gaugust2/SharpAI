// This function takes the analysis JSON object from MongoDB and converts it into a string so that we can send it to OpenAI
const analysisToString = (analysis) => {
  const analysisString = Object.entries(analysis)
    .map(([key, value]) => `${key}: \n${value}`)
    .join("\n\n");

  return analysisString;
};

// This function merges two betslips with the same structure
const  mergeBetslips = (betslip, betslipFromImage) => {
    if (!betslip) return betslipFromImage || {};
    if (!betslipFromImage) return betslip;

    const merged = {
        league: betslip.league || betslipFromImage.league,
        selectedTeam: {
            city: betslip.selectedTeam.city || betslipFromImage.selectedTeam.city,
            name: betslip.selectedTeam.name || betslipFromImage.selectedTeam.name
        },
        opposingTeam: {
            city: betslip.opposingTeam.city || betslipFromImage.opposingTeam.city,
            name: betslip.opposingTeam.name || betslipFromImage.opposingTeam.name
        },
        date: betslip.date || betslipFromImage.date
    };

    return merged;
}

// This function will check if the merged betslip has any empty fields
// If there are empty fields, we cannot query SportsDataIO APIs
const checkEmptyFields = (merged) => {
    let missingFields = [];
    if (!merged.league) missingFields.push("League");
    if (!merged.selectedTeam.city) missingFields.push("Selected Team - city");
    if (!merged.selectedTeam.name) missingFields.push("Selected Team - name");
    if (!merged.opposingTeam.city) missingFields.push("Opposing Team - city");
    if (!merged.opposingTeam.name) missingFields.push("Opposing Team - name");
    if (!merged.date) missingFields.push("Date");

    let response;
    if (missingFields.length > 0) {
        response = `The following fields are missing: ${missingFields.join(", ")}. Please use the form to fill out any remaining fields, and submit again.`;
    }
    return response
}

module.exports = { analysisToString, mergeBetslips, checkEmptyFields}
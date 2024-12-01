import React, { useState } from "react";

const BettingForm = () => {
  const [formData, setFormData] = useState({
    league: "NBA",
    selectedTeamCity: "",
    selectedTeamName: "",
    opposingTeamCity: "",
    opposingTeamName: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload in the required format
    const payload = {
      league: formData.league,
      selectedTeam: {
        city: formData.selectedTeamCity,
        name: formData.selectedTeamName,
      },
      opposingTeam: {
        city: formData.opposingTeamCity,
        name: formData.opposingTeamName,
      },
      date: formData.date, // Assume the user inputs a valid date format
    };

    try {
      const response = await fetch("/betslip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      alert(`Response: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("Error submitting the bet:", error);
      alert("Failed to submit the bet. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        League:
        <select name="league" value={formData.league} onChange={handleChange}>
          <option value="NBA">NBA</option>
          <option value="NFL">NFL</option>
          <option value="MLB">MLB</option>
        </select>
      </label>
      <br />
      <label>
        Selected Team City:
        <input
          type="text"
          name="selectedTeamCity"
          value={formData.selectedTeamCity}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Selected Team Name:
        <input
          type="text"
          name="selectedTeamName"
          value={formData.selectedTeamName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Opposing Team City:
        <input
          type="text"
          name="opposingTeamCity"
          value={formData.opposingTeamCity}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Opposing Team Name:
        <input
          type="text"
          name="opposingTeamName"
          value={formData.opposingTeamName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Date (Valid Formats: October 22 2024, 10/22/2024, 10-22-2024, 2024/10/22):
        <input
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Submit Bet</button>
    </form>
  );
};

export default BettingForm;

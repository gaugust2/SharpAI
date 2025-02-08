import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BettingHistoryUpload = () => {
  const [selectedTeamCity, setSelectedTeamCity] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [opposingTeamCity, setOpposingTeamCity] = useState("");
  const [opposingTeamName, setOpposingTeamName] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({
      selectedTeamCity,
      selectedTeamName,
      opposingTeamCity,
      opposingTeamName,
      date,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Upload Betting History</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Selected Team City (e.g., Dallas)"
          value={selectedTeamCity}
          onChange={(e) => setSelectedTeamCity(e.target.value)}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          placeholder="Selected Team Name (e.g., Mavericks)"
          value={selectedTeamName}
          onChange={(e) => setSelectedTeamName(e.target.value)}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          placeholder="Opposing Team City (e.g., Utah)"
          value={opposingTeamCity}
          onChange={(e) => setOpposingTeamCity(e.target.value)}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          placeholder="Opposing Team Name (e.g., Jazz)"
          value={opposingTeamName}
          onChange={(e) => setOpposingTeamName(e.target.value)}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          placeholder="Date (e.g., November 30 2024 or 10/22/2024)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/chat")}
      >
        Back to Chat
      </button>
    </div>
  );
};

export default BettingHistoryUpload;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ChatPage from "./components/ChatPage";
import BettingHistoryUploadPage from "./components/BettingHistoryUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/upload-betting-history"
          element={<BettingHistoryUploadPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;

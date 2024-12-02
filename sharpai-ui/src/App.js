import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatPage from './components/ChatPage';
import BettingPage from './components/BettingPage';



function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/betting" element={<BettingPage />} />
        </Routes>
    </Router>
  );
}



export default App;

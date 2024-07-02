import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import ForgetPassPage from './pages/ForgetPassPape';
import ResumePage from './pages/ResumePage';
import ResumeSinglePage from './pages/ResumeSinglePage';
import ReviewableResumePage from './pages/ReviewableResumePage';
import ReviewableResumeSinglePage from './pages/ReviewableResumeSinglePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* <Route path="/forget-password" element={<ForgetPassPage />} />{" "} */}
        <Route path="/dashboard" element={<DashboardPage />} />{" "}
        <Route path="/resume" element={<ResumePage />} />{" "}
        <Route path="/resume/:id" element={<ResumeSinglePage />} />
        <Route path="/reviewable-resume" element={<ReviewableResumePage />} />
        <Route path="/reviewable-resume/:id" element={<ReviewableResumeSinglePage />} />
      </Routes>
    </Router>
  );
};

export default App;

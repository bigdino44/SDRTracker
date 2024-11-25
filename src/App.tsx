import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QualificationForm from './components/QualificationForm';
import Leaderboard from './components/Leaderboard';
import Training from './components/Training';
import Calendar from './components/Calendar';
import LeadsManagement from './components/LeadsManagement';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/qualify" element={<QualificationForm />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/leads" element={<LeadsManagement />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
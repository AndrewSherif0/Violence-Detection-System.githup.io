import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './Pages/AdminDashboard.js';
import Login from './Pages/Login.js';
import UserDashboard from './Pages/UserDashboard';
import ReportDetails from './Pages/ReportDetails.js';
import Register from './Pages/Register.js';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/report/:id" element={<ReportDetails />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;

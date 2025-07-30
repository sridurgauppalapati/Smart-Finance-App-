import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Members from './Pages/Members';
import Form from './Pages/Form';
import Calendar from './Pages/Calendar';
import Expectation from './Pages/Expectation';
import Summary from './Pages/Summary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Finance Tracker</h1>
          <div className="nav-links">
            <Link to="/members">Members</Link>
            <Link to="/form">Form</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/expectation">Expectation</Link>
            <Link to="/summary">Summary</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Members />} />
          <Route path="/members" element={<Members />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/expectation" element={<Expectation />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
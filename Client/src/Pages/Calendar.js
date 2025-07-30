import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    fetchMembers();
    fetchEntries();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const getEntryForDate = (selectedDate, memberId) => {
    return entries.find(entry => 
      new Date(entry.date).toDateString() === selectedDate.toDateString() && 
      entry.memberId._id === memberId
    );
  };

  const calculateTotals = (entry) => {
    if (!entry) return { income: 0, expenses: 0, investment: 0, savings: 0 };
    
    const expenses = Object.keys(entry).reduce((total, key) => {
      if (key !== '_id' && key !== 'memberId' && key !== 'date' && key !== 'income' && key !== 'investment' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        return total + (entry[key] || 0);
      }
      return total;
    }, 0);
    
    const savings = entry.income - expenses - entry.investment;
    
    return {
      income: entry.income || 0,
      expenses,
      investment: entry.investment || 0,
      savings: Math.max(0, savings)
    };
  };

  return (
    <div className="page">
      <h2>Calendar View</h2>
      
      <div className="view-controls">
        <button 
          className={viewMode === 'month' ? 'active' : ''}
          onClick={() => setViewMode('month')}
        >
          Month View
        </button>
        <button 
          className={viewMode === 'week' ? 'active' : ''}
          onClick={() => setViewMode('week')}
        >
          Week View
        </button>
      </div>

      <Calendar
        onChange={setDate}
        value={date}
        view={viewMode}
      />

      <div className="date-details">
        <h3>Details for {date.toDateString()}</h3>
        
        {members.map(member => {
          const entry = getEntryForDate(date, member._id);
          const totals = calculateTotals(entry);
          
          return (
            <div key={member._id} className="member-summary">
              <h4 style={{backgroundColor: `hsl(${member._id.slice(-6)}, 70%, 80%)`}}>
                {member.name}
              </h4>
              <div className="financial-summary">
                <span className="income">Income: ₹{totals.income}</span>
                <span className="expenses">Expenses: ₹{totals.expenses}</span>
                <span className="investment">Investment: ₹{totals.investment}</span>
                <span className="savings">Savings: ₹{totals.savings}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
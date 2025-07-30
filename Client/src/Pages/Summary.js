import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Summary = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [members, setMembers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [expectations, setExpectations] = useState([]);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchMembers();
    fetchEntries();
    fetchExpectations();
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

  const fetchExpectations = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/expectations');
      setExpectations(response.data);
    } catch (error) {
      console.error('Error fetching expectations:', error);
    }
  };

  const getMonthlyTotals = (month, year, memberId) => {
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && 
             entryDate.getFullYear() === year && 
             entry.memberId._id === memberId;
    });
    
    return monthEntries.reduce((totals, entry) => {
      const entryTotals = calculateTotals(entry);
      return {
        income: totals.income + entryTotals.income,
        expenses: totals.expenses + entryTotals.expenses,
        investment: totals.investment + entryTotals.investment,
        savings: totals.savings + entryTotals.savings
      };
    }, { income: 0, expenses: 0, investment: 0, savings: 0 });
  };

  const getExpectationForMember = (memberId) => {
    return expectations.find(exp => exp.memberId._id === memberId);
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

  const getStatusColor = (actual, expected) => {
    if (!expected) return '#gray';
    return actual >= expected ? '#4CAF50' : '#F44336';
  };
  
  const getMemberMonthStatus = (month, year, memberId) => {
    const totals = getMonthlyTotals(month, year, memberId);
    const expectation = getExpectationForMember(memberId);
    
    if (!expectation) return '#gray';
    
    const expectedInvestment = (expectation.income * expectation.investmentPercentage) / 100;
    const expectedSavings = (expectation.income * expectation.savingsPercentage) / 100;
    
    const investmentMet = totals.investment >= expectedInvestment;
    const savingsMet = totals.savings >= expectedSavings;
    const incomeMet = totals.income >= expectation.income;
    
    return (investmentMet && savingsMet && incomeMet) ? '#4CAF50' : '#F44336';
  };

  return (
    <div className="page">
      <h2>Summary - Performance vs Expectations</h2>
      
      <div className="year-selector">
        <button onClick={() => setSelectedYear(selectedYear - 1)}>‹</button>
        <h3>{selectedYear}</h3>
        <button onClick={() => setSelectedYear(selectedYear + 1)}>›</button>
      </div>
      
      <div className="months-grid">
        {months.map((month, index) => (
          <div 
            key={month} 
            className={`month-card ${selectedMonth === index ? 'selected' : ''}`}
            onClick={() => setSelectedMonth(index)}
          >
            <h4>{month}</h4>
            <div className="member-tags">
              {members.map(member => (
                <div 
                  key={member._id}
                  className="member-tag"
                  style={{
                    backgroundColor: getMemberMonthStatus(index, selectedYear, member._id),
                    color: 'white'
                  }}
                >
                  {member.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="summary-details">
        <h3>Performance Summary for {months[selectedMonth]} {selectedYear}</h3>
        
        {members.map(member => {
          const totals = getMonthlyTotals(selectedMonth, selectedYear, member._id);
          const expectation = getExpectationForMember(member._id);
          
          if (!expectation) {
            return (
              <div key={member._id} className="member-summary">
                <h4 style={{backgroundColor: '#gray', color: 'white', padding: '10px'}}>
                  {member.name} - No Expectations Set
                </h4>
              </div>
            );
          }

          const expectedValues = {
            necessary: (expectation.income * expectation.necessaryPercentage) / 100,
            spending: (expectation.income * expectation.spendingPercentage) / 100,
            savings: (expectation.income * expectation.savingsPercentage) / 100,
            investment: (expectation.income * expectation.investmentPercentage) / 100
          };

          const necessaryActual = totals.expenses; // Assuming expenses are necessary
          const investmentStatus = getStatusColor(totals.investment, expectedValues.investment);
          const savingsStatus = getStatusColor(totals.savings, expectedValues.savings);
          const incomeStatus = getStatusColor(totals.income, expectation.income);

          return (
            <div key={member._id} className="member-summary">
              <h4 style={{
                backgroundColor: getMemberMonthStatus(selectedMonth, selectedYear, member._id),
                color: 'white',
                padding: '10px',
                margin: '10px 0'
              }}>
                {member.name} - {months[selectedMonth]} {selectedYear}
              </h4>
              
              <div className="performance-grid">
                <div className="performance-item">
                  <span>Income:</span>
                  <span style={{color: incomeStatus}}>
                    ₹{totals.income} / ₹{expectation.income}
                  </span>
                </div>
                
                <div className="performance-item">
                  <span>Necessary Expenses:</span>
                  <span style={{color: getStatusColor(expectedValues.necessary, necessaryActual)}}>
                    ₹{necessaryActual} / ₹{expectedValues.necessary.toFixed(2)}
                  </span>
                </div>
                
                <div className="performance-item">
                  <span>Investment:</span>
                  <span style={{color: investmentStatus}}>
                    ₹{totals.investment} / ₹{expectedValues.investment.toFixed(2)}
                  </span>
                </div>
                
                <div className="performance-item">
                  <span>Savings:</span>
                  <span style={{color: savingsStatus}}>
                    ₹{totals.savings} / ₹{expectedValues.savings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="legend">
        <div style={{color: '#4CAF50'}}>● Green: Meeting or exceeding expectations</div>
        <div style={{color: '#F44336'}}>● Red: Below expectations</div>
      </div>
    </div>
  );
};

export default Summary;
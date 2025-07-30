import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expectation = () => {
  const [members, setMembers] = useState([]);
  const [expectations, setExpectations] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [formData, setFormData] = useState({
    income: 0,
    necessaryPercentage: 50,
    spendingPercentage: 20,
    savingsPercentage: 20,
    investmentPercentage: 10
  });

  useEffect(() => {
    fetchMembers();
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

  const fetchExpectations = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/expectations');
      setExpectations(response.data);
    } catch (error) {
      console.error('Error fetching expectations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      const existingExpectation = expectations.find(exp => exp.memberId._id === selectedMember);
      
      if (existingExpectation) {
        await axios.put(`http://localhost:5001/api/expectations/${existingExpectation._id}`, {
          ...formData,
          memberId: selectedMember
        });
      } else {
        await axios.post('http://localhost:5001/api/expectations', {
          ...formData,
          memberId: selectedMember
        });
      }
      
      fetchExpectations();
      alert('Expectations saved successfully!');
    } catch (error) {
      console.error('Error saving expectations:', error);
    }
  };

  const calculateValues = () => {
    const income = formData.income;
    return {
      necessary: (income * formData.necessaryPercentage) / 100,
      spending: (income * formData.spendingPercentage) / 100,
      savings: (income * formData.savingsPercentage) / 100,
      investment: (income * formData.investmentPercentage) / 100
    };
  };

  const values = calculateValues();

  return (
    <div className="page">
      <h2>Financial Expectations</h2>
      
      <select 
        value={selectedMember} 
        onChange={(e) => setSelectedMember(e.target.value)}
        required
      >
        <option value="">Select Member</option>
        {members.map(member => (
          <option key={member._id} value={member._id}>{member.name}</option>
        ))}
      </select>

      {selectedMember && (
        <form onSubmit={handleSubmit} className="expectation-form">
          <div className="form-field">
            <label>Monthly Income (₹)</label>
            <input
              type="number"
              value={formData.income}
              onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
              required
            />
          </div>

          <div className="percentage-fields">
            <div className="form-field">
              <label>Necessary Expenses (%)</label>
              <input
                type="number"
                value={formData.necessaryPercentage}
                onChange={(e) => setFormData({...formData, necessaryPercentage: Number(e.target.value)})}
                max="100"
              />
              <span className="calculated-value">₹{values.necessary.toFixed(2)}</span>
            </div>

            <div className="form-field">
              <label>Spending (%)</label>
              <input
                type="number"
                value={formData.spendingPercentage}
                onChange={(e) => setFormData({...formData, spendingPercentage: Number(e.target.value)})}
                max="100"
              />
              <span className="calculated-value">₹{values.spending.toFixed(2)}</span>
            </div>

            <div className="form-field">
              <label>Savings (%)</label>
              <input
                type="number"
                value={formData.savingsPercentage}
                onChange={(e) => setFormData({...formData, savingsPercentage: Number(e.target.value)})}
                max="100"
              />
              <span className="calculated-value">₹{values.savings.toFixed(2)}</span>
            </div>

            <div className="form-field">
              <label>Investment (%)</label>
              <input
                type="number"
                value={formData.investmentPercentage}
                onChange={(e) => setFormData({...formData, investmentPercentage: Number(e.target.value)})}
                max="100"
              />
              <span className="calculated-value">₹{values.investment.toFixed(2)}</span>
            </div>
          </div>

          <div className="total-check">
            Total: {formData.necessaryPercentage + formData.spendingPercentage + formData.savingsPercentage + formData.investmentPercentage}%
          </div>

          <button type="submit">Save Expectations</button>
        </form>
      )}

      <div className="existing-expectations">
        <h3>Current Expectations</h3>
        {expectations.map(exp => (
          <div key={exp._id} className="expectation-card">
            <h4>{exp.memberId.name}</h4>
            <p>Income: ₹{exp.income}</p>
            <p>Necessary: {exp.necessaryPercentage}% (₹{(exp.income * exp.necessaryPercentage / 100).toFixed(2)})</p>
            <p>Spending: {exp.spendingPercentage}% (₹{(exp.income * exp.spendingPercentage / 100).toFixed(2)})</p>
            <p>Savings: {exp.savingsPercentage}% (₹{(exp.income * exp.savingsPercentage / 100).toFixed(2)})</p>
            <p>Investment: {exp.investmentPercentage}% (₹{(exp.income * exp.investmentPercentage / 100).toFixed(2)})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expectation;
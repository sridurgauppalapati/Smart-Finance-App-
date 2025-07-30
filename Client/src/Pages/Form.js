import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PDFUploader from '../components/PDFUploader';

const Form = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    homeEmi: 0, carEmi: 0, personalLoanEmi: 0, creditcardEmi: 0,
    homeMaintenance: 0, waterCharges: 0, netPhoneCharges: 0, transport: 0,
    foodOrders: 0, groceries: 0, clothing: 0, travelling: 0,
    carMaintenance: 0, petrol: 0, bikeMaintenance: 0, maid: 0,
    urbanCompany: 0, drinkingWater: 0, donations: 0, school: 0,
    gym: 0, badminton: 0, eatery: 0, onlineShopping: 0,
    repairsReplacements: 0, otherincome: 0, investment: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    try {
      await axios.post('http://localhost:5001/api/entries', {
        ...formData,
        memberId: selectedMember
      });
      alert('Entry saved successfully!');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formDataPdf = new FormData();
    formDataPdf.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:5001/api/pdf/extract', formDataPdf, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, ...response.data }));
      alert('PDF data extracted successfully!');
    } catch (error) {
      console.error('PDF extraction failed:', error);
      alert('Failed to extract data from PDF');
    }
  };

  const expenseFields = [
    'homeEmi', 'carEmi', 'personalLoanEmi', 'creditcardEmi', 'homeMaintenance',
    'waterCharges', 'netPhoneCharges', 'transport', 'foodOrders', 'groceries',
    'clothing', 'travelling', 'carMaintenance', 'petrol', 'bikeMaintenance',
    'maid', 'urbanCompany', 'drinkingWater', 'donations', 'school',
    'gym', 'badminton', 'eatery', 'onlineShopping', 'repairsReplacements'
  ];

  return (
    <div className="page">
      <h2>Daily Entry Form</h2>
      
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

      <PDFUploader onTransactionsImported={(data) => {
        alert(`✅ ${data.message}`);
        console.log('Auto-matched member:', data.memberName);
        console.log('Imported entries:', data.entries);
      }} />

      {selectedMember && (
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="pdf-upload">
            <label>Upload PDF Statement (Optional):</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
            />
          </div>
          
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
          
          <div className="form-grid">
            {expenseFields.map(field => (
              <div key={field} className="form-field">
                <label>{field.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
                <input
                  type="number"
                  value={formData[field]}
                  onChange={(e) => setFormData({...formData, [field]: Number(e.target.value)})}
                  placeholder="₹0"
                />
              </div>
            ))}
            
            <div className="form-field">
              <label>Income</label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                placeholder="₹0"
              />
            </div>
            
            <div className="form-field">
              <label>Investment</label>
              <input
                type="number"
                value={formData.investment}
                onChange={(e) => setFormData({...formData, investment: Number(e.target.value)})}
                placeholder="₹0"
              />
            </div>
          </div>
          
          <button type="submit">Save Entry</button>
        </form>
      )}
    </div>
  );
};

export default Form;
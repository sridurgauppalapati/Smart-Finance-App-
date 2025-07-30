import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', profession: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      console.log('Fetching members...');
      const response = await axios.get('http://localhost:5001/api/members');
      console.log('Members fetched:', response.data);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Submitting member:', formData);
      const response = await axios.post('http://localhost:5001/api/members', formData);
      console.log('Member added:', response.data);
      setFormData({ name: '', age: '', profession: '' });
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Members</h2>
      
      <form onSubmit={handleSubmit} className="member-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Profession"
          value={formData.profession}
          onChange={(e) => setFormData({...formData, profession: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>

      <div className="members-list">
        {members.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          members.map(member => (
            <div key={member._id} className="member-card">
              <h3>{member.name}</h3>
              <p>Age: {member.age}</p>
              <p>Profession: {member.profession}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Members;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let isMongoConnected = false;

mongoose.connect('mongodb://localhost:27017/financeapp', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    isMongoConnected = true;
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed, using in-memory fallback');
    console.log('Error:', err.message);
    console.log('💡 Install MongoDB locally or check MongoDB Atlas connection');
    isMongoConnected = false;
  });

// Export connection status
app.locals.isMongoConnected = () => isMongoConnected;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Finance App API Server', 
    status: 'Running', 
    port: PORT,
    database: isMongoConnected ? 'MongoDB Connected' : 'Using In-Memory Storage'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'Running',
    database: isMongoConnected ? 'Connected' : 'Disconnected',
    storage: isMongoConnected ? 'MongoDB' : 'In-Memory'
  });
});

app.use('/api/members', require('./routes/members'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/expectations', require('./routes/expectations'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/pdf', require('./routes/pdf-processor'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
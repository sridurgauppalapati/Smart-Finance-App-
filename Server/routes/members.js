const express = require('express');
const Member = require('../models/Member');
const router = express.Router();

// In-memory fallback storage
let membersStorage = [];
let nextId = 1;

router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.log('MongoDB error, using in-memory storage:', error.message);
    res.json(membersStorage);
  }
});

router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.log('MongoDB error, using in-memory storage:', error.message);
    const newMember = {
      _id: nextId++,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    membersStorage.push(newMember);
    res.status(201).json(newMember);
  }
});

module.exports = router;
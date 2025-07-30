const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().populate('memberId');
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/member/:memberId', async (req, res) => {
  try {
    const entries = await Entry.find({ memberId: req.params.memberId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
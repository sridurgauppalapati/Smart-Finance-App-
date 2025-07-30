const express = require('express');
const Expectation = require('../models/Expectation');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const expectations = await Expectation.find().populate('memberId');
    res.json(expectations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const expectation = new Expectation(req.body);
    await expectation.save();
    res.status(201).json(expectation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expectation = await Expectation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expectation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
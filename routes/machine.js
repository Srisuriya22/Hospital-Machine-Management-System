const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const auth = require('../middleware/auth'); // Authentication middleware

// Add a new machine
router.post('/add', auth, async (req, res) => {
  const { type, definition, brand } = req.body;
  const userId = req.user.id;

  try {
    if (!type || !definition || !brand) {
      return res.status(400).json({ success: false, message: 'Please provide type, definition, and brand' });
    }

    const newMachine = new Machine({
      type,
      definition,
      brand,
      user: userId // Ensure correct field name
    });

    const savedMachine = await newMachine.save();
    res.status(201).json({ success: true, machine: savedMachine });
  } catch (err) {
    console.error('Error adding machine:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Fetch all machines
router.get('/all', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const machines = await Machine.find({ user: userId });
    res.status(200).json({ success: true, machines });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching machines', error: err.message });
  }
});

// Fetch all machines for all users
router.get('/all-machines', async (req, res) => {
  try {
    const machines = await Machine.find({});
    res.status(200).json({ success: true, machines });
  } catch (err) {
    console.error('Error fetching machines:', err);
    res.status(500).json({ success: false, message: 'Error fetching machines', error: err.message });
  }
});
// Fetch a single machine by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }
    res.json({ success: true, machine });
  } catch (err) {
    console.error('Error fetching machine:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});



// Update machine
router.put('/update/:id', auth, async (req, res) => {
  const { type, definition, brand } = req.body;
  const userId = req.user.id;
  const machineId = req.params.id;

  try {
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }

    if (machine.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this machine' });
    }

    machine.type = type;
    machine.definition = definition;
    machine.brand = brand;

    await machine.save();
    res.json({ success: true, machine });
  } catch (err) {
    console.error('Error updating machine:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Delete a machine
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deletedMachine = await Machine.findByIdAndDelete(req.params.id);
    if (!deletedMachine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }
    res.json({ success: true, message: 'Machine deleted successfully' });
  } catch (err) {
    console.error('Error deleting machine:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Search for machines
router.get('/search', auth, async (req, res) => {
  const { type } = req.query;
  const userId = req.user.id;

  try {
    const query = { user: userId };
    if (type) query.type = type;
    const machines = await Machine.find(query);
    res.status(200).json({ success: true, machines });
  } catch (err) {
    console.error('Error searching machines:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

module.exports = router;

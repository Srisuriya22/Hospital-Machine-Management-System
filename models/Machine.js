// models/Machine.js
const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  type: { type: String, required: true },
  definition: { type: String, required: true },
  brand: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Store the user ID
});

const Machine = mongoose.model('Machine', machineSchema);
module.exports = Machine;

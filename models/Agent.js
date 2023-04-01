const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);

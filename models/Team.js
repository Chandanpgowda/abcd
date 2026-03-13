const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "President", "Technical Lead"
  photo: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  order: { type: Number, default: 0 } // for sorting
});

module.exports = mongoose.model('Team', teamSchema);
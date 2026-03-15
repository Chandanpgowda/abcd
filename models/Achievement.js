const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  category: { type: String, enum: ['award', 'competition', 'workshop', 'testimonial', 'other'], default: 'other' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Achievement', achievementSchema);
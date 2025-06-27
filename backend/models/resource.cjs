
// models/resource.js

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  course: String,
  year: String,
  semester: String,
  subject: String,
  category: String, // "Notes", "Books", "PYQs"
  url: String, // Link to the PDF
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);

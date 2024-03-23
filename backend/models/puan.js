const mongoose = require('mongoose');

const puanSchema = new mongoose.Schema({
  filmId: {
    type: String,
    required: true,
  },
  tur: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  puan: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Puan', puanSchema);
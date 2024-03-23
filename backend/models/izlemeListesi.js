const mongoose = require('mongoose');

const IzlemeListesiSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
});

const IzlemeListesi = mongoose.model('IzlemeListesi', IzlemeListesiSchema);

module.exports = IzlemeListesi;
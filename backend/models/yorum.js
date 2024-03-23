const mongoose = require('mongoose');

const YorumSchema = new mongoose.Schema({
    userName: {
      type: String,
    },
    filmId: {
      type: String,
    },
    icerik: {
      type: String,
    },
    durum: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  

const Yorum = mongoose.model('Yorum', YorumSchema);

module.exports = Yorum;
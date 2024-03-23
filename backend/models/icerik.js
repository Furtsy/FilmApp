const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const İcerikSchema = new mongoose.Schema({
  filmId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tur: {
    type: String,
    default: "local",
  },
  createdby: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const İcerik = mongoose.model('İcerik', İcerikSchema);

module.exports = İcerik;
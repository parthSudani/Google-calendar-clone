// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  Id: Number,
  Subject:String,
  StartTime: Date,
  EndTime: Date,
  });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

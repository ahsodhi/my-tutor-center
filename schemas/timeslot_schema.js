var mongoose = require('mongoose');

var timeSlotSchema = mongoose.Schema({
  day: Number, // day(0-6)
  start: [Number], // hour(0-12), min(0-59), am/pm(0-1)
  end: [Number]
});

module.exports = timeSlotSchema;

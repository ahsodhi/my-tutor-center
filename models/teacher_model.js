var mongoose = require('mongoose'),
    eventSchema = require('../schemas/event_schema');

var packageSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  address: String,
  subjects: [mongoose.Schema.Types.ObjectId],
  notes: String,
  wage: Number,
  wagePeriod: Number, // 0 = per hour, 1 = per week, 2 = per month, 3 = per year,
  events: [eventSchema]
});

module.exports = mongoose.model('Teacher', packageSchema);

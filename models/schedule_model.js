var mongoose = require('mongoose'),
    eventSchema = require('../schemas/event_schema');

var scheduleSchema = mongoose.Schema({
  student: mongoose.Schema.Types.ObjectId,
  teacher: mongoose.Schema.Types.ObjectId,
  pack: mongoose.Schema.Types.ObjectId,
  events: [eventSchema]
});

module.exports = mongoose.model('Schedule', scheduleSchema);

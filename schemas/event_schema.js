var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  start: Date,
  end: Date
});

module.exports = eventSchema;

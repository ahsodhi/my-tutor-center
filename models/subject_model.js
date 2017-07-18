var mongoose = require('mongoose');

var subjectSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Subject', subjectSchema);

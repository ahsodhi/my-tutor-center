var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
  students: [{
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    status: String, // 0 = inactive, 1 = active, 2 = prospect
    notes: String,
    school: String,
    grade: Number,
    packs: [mongoose.Schema.Types.ObjectId],
    billing: String // 0 = per session, 1 = tutoring package
  }],
  parents: [{
      firstName: String,
      lastName: String,
      homePhone: String,
      cellPhone: String,
      notes: String,
      email: String,
      address: String
  }]
});

module.exports = mongoose.model('Client', clientSchema);

var mongoose = require('mongoose');

var packageSchema = mongoose.Schema({
  name: String,
  period: String, // 0 = weekly, 1 = monthly
  price: Number,
  grades: [Number], // 0 = other
  description: String,
  subjects: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Package', packageSchema);

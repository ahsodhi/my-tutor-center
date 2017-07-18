var mongoose = require('mongoose');

var payment = mongoose.Schema({
  amount: Number,
  date: Date,
  method: Number // 1 = credit, 2 = debit 3 = cash
});

var paymentSchema = mongoose.Schema({
  schedule: mongoose.Schema.Types.ObjectId,
  payments: [payment]
});

module.exports = mongoose.model('Payment', paymentSchema);

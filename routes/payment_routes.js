var express = require('express'),
    paymentModel = require('../models/payment_model');

var app = express.Router();

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

app.post('/update', function(req, res) {
  console.log('payments routes', req.body);
  paymentModel.findOne({schedule:req.body.schedule}, function(err, model) {
    if (isEmpty(model)) {
      var Model = new paymentModel({schedule:req.body.schedule,
        payments:[{amount:req.body.amount,date:req.body.date,method:req.body.method}]
      });
      Model.save(function(err, model) {
        if (err) { res.json({success: false, message: err}); }
        else { res.json({ success: true, data: Model}); }
      })
    }
    else {
      console.log(model);
      model.payments.push({amount:req.body.amount,date:req.body.date,method:req.body.method});
      model.save(function(err, model) {
        if (err) { res.json({success: false, message: err}); }
        else { res.json({ success: true, data: model}); }
      })
    }
  })
});

module.exports = app;

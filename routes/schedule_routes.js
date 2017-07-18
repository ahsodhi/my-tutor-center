var express = require('express'),
    scheduleModel = require('../models/schedule_model');

var app = express.Router();

app.post('/', function(req, res) {
  scheduleModel.findOne({student:req.body.student,pack:req.body.pack}, function(err, model) {
    if (!err) {
      return res.json({success: true, data: model});
    }
    else {
      return res.json({success: false});
    }
  })
});

module.exports = app;

var express = require('express');

var createRoutes = function(Model) {
  var router = express.Router();

  router.post('/add', function(req, res) {
    var newModel = new Model(req.body);
    newModel.save(function(err, model) {
      if (err) { res.json({success: false, message: err}); }
      else { res.json({ success: true, data: model}); }
    })
  });

  router.get('/', function(req, res) {
    Model.find({}, function(err, models) {
      if (err) { res.json({ success: false, message: err }); }
      else { res.json({ success: true, data: models }); }
    });
  });

  router.get('/:id', function(req, res) {
    Model.findById(req.params.id, function(err, model) {
      if (err) { res.json({ success: false, message: err }); }
      else { res.json({ success: true, data: model }); }
    });
  });

  router.put('/:id', function(req, res) {
    Model.findByIdAndUpdate(req.params.id, req.body, function(err, model) {
      if (err) { res.json({ success:false, message: err }); }
      else { res.json({ success: true, data: model}); }
    })
  });

  router.delete('/:id', function(req, res) {
    Model.findByIdAndRemove(req.params.id, function(err, doc) {
      if (err) { res.json({ success:false, message: err }); }
      else { res.json({ success: true, message: 'model deleted successfully', data: doc}); }
    })
  });

  return router;
}

module.exports = { createRoutes }

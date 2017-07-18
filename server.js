var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var Helpers = require('./helpers');

var { teacherModel, packageModel, clientModel, subjectModel, scheduleModel, paymentModel } = require('./models');
var paymentRoutes = require('./routes/payment_routes'),
    scheduleRoutes = require('./routes/schedule_routes');

var DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/shaily';
mongoose.connect('mongodb://admin:APOORVA1@ds157682.mlab.com:57682/shailytutorials');

var app = express();

app.use(express.static(path.join(__dirname, 'src')))
app.use(bodyParser.json());

app.use('/api/clients', Helpers.createRoutes(clientModel));
app.use('/api/packages', Helpers.createRoutes(packageModel));
app.use('/api/teachers', Helpers.createRoutes(teacherModel));
app.use('/api/subjects', Helpers.createRoutes(subjectModel));
app.use('/api/schedules', Helpers.createRoutes(scheduleModel));
app.use('/api/payments', Helpers.createRoutes(paymentModel));
app.use('/api/payments', paymentRoutes);
app.use('/api/find_student_schedule', scheduleRoutes);

app.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(3000, function() { console.log('express server started')});

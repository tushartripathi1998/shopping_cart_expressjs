var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require("./config/database.js");
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require("express-validator"); 

//Init the app
var app = express();

//making a db connection
mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :'));
db.once('open' ,function(){
    console.log("connected to mongodb");
});

//View engine setup
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

//set public folder 
app.use(express.static(path.join(__dirname, 'public')));

//Body parsermiddleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//Express validator
const { check, validationResult } = require('express-validator/check');
app.post('/user', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

//express-mesages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//routing
var pages = require('./routes/pages.js');
var adminpages = require('./routes/admin_pages.js');
app.use('/admin/pages', adminpages);
app.use('/', pages);

//port mapping
var port = 3000;

//run the app
app.listen(port, function(){console.log("listening on port"+port);});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');


mongoose.connect('mongodb://localhost/NodeCourse');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
	secret: 'hamed davandeh nemidavad',
	resave: false,
	saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// In this example, the formParam value is going to get morphed into form body format useful for printing. 
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var dashboard = require('./dashboard');

app.use('/dashboard', dashboard);

app.set('view engine','pug');
app.use(express.static(__dirname+'/public'));


app.get('/', function(req, res){
	res.render('index', {
		title: 'Data-Diode',
		name: 'Hamed Davandeh'
	});
});

app.get('/session', function(req, res){
  res.json(req.cookies);
});

app.listen(3000, function(){
	console.log('express is running on port 3000');
});
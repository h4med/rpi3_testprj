var express = require('express');
var router = express.Router();
var User = require('./model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		next();
		return;
	}
	res.redirect('/dashboard/login');
}

router.get('/', isLoggedIn, function(req, res){
	res.send('dashboard Page');
});

router.get('/login', function(req, res){
	res.render('login.pug', {
		title:'login page'
	});
});

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function (err, user) {
      done(err, user);
   });
});

passport.use

router.post('/login', function(req, res, next){
	// res.json(req.body);
	var email = req.body.email;
	var password = req.body.password;

	req.checkBody('email', 'E-Mail is Required!').notEmpty();
	req.checkBody('password', 'password is Required!').notEmpty();

	var errors = req.validationErrors();
	if (errors) {

	    res.render('login.pug', {
	  		title: 'Login page',
	  		errors: errors,
	  		email: email
	  });
	  console.log('validate error: '+errors);
	  return;
	}	

	next();

}, passport.authenticate('local-login', {failureRedirect: '/dashboard/login'}),function(req, res){
	console.log('Login Successfull');
	res.redirect('/dashboard');
});

router.get('/register', function(req, res){
	res.render('register.pug', {
		title:'register page'
	});
});

router.post('/register', function(req, res){
	// res.json(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password_confirmation = req.body.password_confirmation;

	req.checkBody('name', 'Name is Required!').notEmpty();
	req.checkBody('email', 'E-Mail is Required!').notEmpty();
	req.checkBody('email', 'Must be a valid address!').isEmail();
	req.checkBody('password', 'password is Required!').notEmpty();
	req.checkBody('password_confirmation', 'Confirm Password is Required!').notEmpty();
	req.checkBody('password_confirmation', 'Passwords Not eqaul!').equals(password);

	var errors = req.validationErrors();
	if (errors) {
	  // do something with the errors 
	    res.render('register.pug', {
	  		title: 'Register page',
	  		errors: errors,
	  		name: name,
	  		email: email
	  });
	  // res.send('There has been validation errors: ', + util.inspect(errors), 400);
	  return;
	}
	var newUser = new User({
		name: name,
		email: email,
		password: User.generateHash(password)
	});

	// res.json(req.body);

	newUser.save(function(err){
		if(err) throw err;

		console.log('User Created');
		res.redirect('/dashboard/login');
	});

});

module.exports = router;


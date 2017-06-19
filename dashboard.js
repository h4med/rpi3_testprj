var express = require('express');
var router = express.Router();
var User = require('./model/user');


router.get('/', function(req, res){
	res.send('dashboard');
});

router.get('/login', function(req, res){
	res.render('login.pug', {
		title:'login page'
	});
});

router.post('/login', function(req, res){
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

	User.findOne({email:email}, function(err, user){
		if(err) throw err;

		if(!user){
			res.redirect('/dashboard/login');
			return;
		}
		if(User.validPassword(password, user.password)){
			res.redirect('/dashboard');
			return;
		}
		res.redirect('/dashboard/login');
	});


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


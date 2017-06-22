var express = require('express');
var router = express.Router();
var User = require('./model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function isLoggedIn(req , res , next) {
   if(req.isAuthenticated()) {
      next();
      return;
   }
   res.redirect('/dashboard/login');
}

router.get('/' , isLoggedIn ,  function (req ,res) {
   res.send('Dasbhoard Page');
});

router.get('/create-post' , isLoggedIn , function (req, res) {
   res.send('page create post')
})

router.get('/login' , function (req, res) {
   res.render('login.pug' ,{
      title : "Login Page"
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

passport.use('local-login' ,new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
   },
   function (email , password , done) {
      User.findOne({ email : email } , function (err , user) {
        if(err) { return done(err); }

        if(!user) {
           return done(null,false,{});
        }

        if(! User.validPassword(password , user.password)) {
           return done(null , false , {});
        }

        return done(null , user);
     });
   }
));


router.post('/login' , function (req ,res , next) {

   var email = req.body.email;
   var password = req.body.password;

   req.checkBody('email' , 'The email field is required').notEmpty();
   req.checkBody('password' , 'The password field is required').notEmpty();

   var errors = req.validationErrors();
   if (errors) {
      res.render('login.pug' , {
         title : 'Login Page',
         errors : errors
      });
      return;
   }

   next();
} , passport.authenticate('local-login' , { failureRedirect: '/dashboard/login' }), function (req, res) {
   console.log('login success');
   res.redirect('/dashboard');
});

router.get('/register' , function (req, res) {
   res.render('register.pug' , {
      title: 'Register Page'
   });
});

router.post('/register' , function (req, res) {
   var name  = req.body.name;
   var email = req.body.email;
   var password = req.body.password;
   var password_confirmation = req.body.password_confirmation;

   req.checkBody('name' , 'The Name field is required').notEmpty();
   req.checkBody('email' , 'The email field is required').notEmpty();
   req.checkBody('email' , 'The email must be a valid email adress').isEmail();
   req.checkBody('password' , 'The password field is required').notEmpty();
   req.checkBody('password_confirmation' , 'The Confirm Password field is required').notEmpty();
   req.checkBody('password_confirmation' , 'Password do not match').equals(password);


   var errors = req.validationErrors();
   if (errors) {
      res.render('register.pug' , {
         title : 'Register Page',
         errors : errors,
         name : name,
         email:email
      });
      return;
   }

   var newUser = new User({
      name:name,
      email:email,
      password: User.generateHash(password)
   });

   newUser.save(function (err) {
      if(err) throw err;

      res.redirect('/dashboard/login');
   });

});

module.exports = router;
var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require('../userController');
var UserModel = require('../models/user');
var Merch = require('../models/merch');
var TheMerch = require('../models/merch');
var merchListing = [];


// Send the error message back to the client
var sendError = function (req, res, err, message) {
  console.log('Render the error template back to the client.');
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

// Retrieve all merch for the current user
var getUserMerch = function (userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  TheMerch.find({user: userId}, function (err, merch) {
    if (!err) {
      console.log('Merch found = ' + merch.length);
      console.log('No errors when looking up merch. Resolve the promise (even if none were found).');
      deferred.resolve(merch);
    } else {
      console.log('There was an error looking up merch. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


/* GET users listing/Handle request for registration form */
app.get("/register", function(req, res) {
  console.log('hit register');
  res.render("register");
});

/* GET users listing/Handle request for login form */
app.get("/login", function(req, res) {
  res.render("login");
});


// Handle the registration form post
app.post("/register", function (req, res) {
  console.log("hit post/register form");
  var newUser = new UserModel(req.body);
  console.log('Here is the new user', newUser);

  newUser.save(function (err, user) {
    console.log("save function done");
    if (err) {
      sendError(req, res, err, "Failed to register user");
    } else {
      console.log("created user", user);
      res.redirect("/users/login");
    }
  });
});


//Handle the login action
app.post("/login", function (req, res) {

  console.log('Hi, this is Node handling the /user/login route');

  // Attempt to log the user is with provided credentials
  UserController.login(req.body.username, req.body.password)

    // After the database call is complete and successful,
    // the promise returns the user object
    .then(function (validUser) {

      console.log('Ok, now we are back in the route handling code and have found a user');
      console.log('validUser',validUser);
      console.log('Find any merch that is assigned to the user');

      // Now find the merch that belong to the user
          res.render("auction");
        })
        .fail(function (err) {
          sendError(req, res, {errors: err.message}, "Failed");
        });
});

//Handle the logout function
app.get("/logout", function (req, res) {
UserController.logout();
res.redirect("/");
});

//Handle user profile page
app.get("/profile", function (req, res) {
  var user = UserController.getCurrentUser();

  if (user !== null) {
    getUserMerch(user._id).then(function (merch) {
      res.render("profile", {
        username: user.username,
        movies: merch
      });
    });
  } else {
    res.redirect("/");
  }

});



module.exports = app;
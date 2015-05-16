var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/user");
//var Merch = require("../models/merch");
//var TheMerch = require('../models/merch');
//var merchList = [];


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
  console.log('Here is the new user', newUser)

  newUser.save(function (err, user) {
    console.log("save function done")
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
      getUserMerch(validUser._id)
        .then(function (merch) {
          // Render the merch list
          res.redirect("/merch/list");
        })
        .fail(function (err) {
          sendError(req, res, {errors: err.message}, "Failed")
        });
    })

    // After the database call is complete but failed
    .fail(function (err) {
      console.log('Failed looking up the user');
      sendError(req, res, {errors: err.message}, "Failed")
    })
});


//Handle user profile page
app.get("/profile", function (req, res) {
  var user = UserController.getCurrentUser();

  if (user !== null) {
    getUserMerch(user._id).then(function (merch) {
      res.render("userProfile", {
        username: user.username,
        movies: merch
      });
    });
  } else {
    res.redirect("/");
  }

});


module.exports = app;
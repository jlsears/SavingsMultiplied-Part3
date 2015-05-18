var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var app = express.Router();
var merchListing = [];

var TheMerch = require('../models/merch');
var User = require('../models/user');

// Send the error message back to the client
var sendError = function (req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};


// B. Send the merch list back to the client

var sendMerchList = function (req, res, next) {
  TheMerch.find({}, function (err, merching) {  //What's stored in merch? An array

    //Swap out the user._id for user.username in each task

      var theUser = UserController.getCurrentUser(); //theUser is the entire object
      console.log(theUser.username);

    //Loop over the merch array
    for (var i = 0; i < merching.length; i++) {
      merching[i].user = theUser.username;  //if you crazily wanted to display password instead, theUser.password
    }

    console.log('merching',merching);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get merch list");
    } else {
      res.render("merchlist", {
        title: "List of merch",
        message: "Just look at what you've been up to here," + " " + theUser.username + "...",
        welcome: "Welcome, seller!",
        merchLength: merching.length,
        merching: merching
      });
    }
  });
};


/* GET users listing/Handle request for merch list */
app.get("/list", function(req, res) {
  console.log('hit merchlist');
  res.render("merchlist");
});

// C. Handle a GET request from the client to /merchy/list
app.get('/list', function (req,res,next) {
  // Is the user logged in?
  console.log("merch thing happening here");
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  sendMerchList(req, res, next);
});


// E. Handle a GET request from the client to /merchsubmission
app.get('/', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  // Send the movie form back to the client
  res.render('merchsubmission', {
    themerch: {
      title: '',
      size: '',
      price: '',
      endDate: ''
    }
  })
})


// G. Handle a POST request from the client to /merchsubmission
app.post('/', function (req, res, next) {
  console.log("This is posting form create");

  // User is editing an existing item
 
    // Who is the user?
    var theUser = UserController.getCurrentUser();

    // What did the user enter in the form?
    var theFormPostData = req.body
    theFormPostData.user = theUser._id;

    console.log('theFormPostData **** Showing reception of data ***** ',theFormPostData);


    var mymerch = new TheMerch(theFormPostData);

    mymerch.save(function (err, mymerch) {
      console.log(mymerch, '***this is form data saving')
      if (err) {
        sendError(req, res, err, "Failed to save task");
      } else {
        res.redirect('merchy/list');
      }
    });
});

//GET the user id for retrieving stored form data if logged in
app.get('/:id', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  TheMerch.find({ _id: req.params.id }, function (err, merch) {
    var thisMerch = merch[0];

    // Was there an error when retrieving?
    if (err) {
      sendError(req, res, err, "Could not find a merch item with that id");

    // Find was successful
    } else {
      res.render('merchsubmission', {
        title : 'Express Merch Example',
        themerch: thisMerch
      });
    }
  });
});

module.exports = app;

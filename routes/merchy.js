var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var app = express.Router();
var merchList = [];


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
  TheMerch.find({}, function (err, merch) {  //What's stored in merch? An array

    //Swap out the user._id for user.username in each task

      var theUser = UserController.getCurrentUser(); //theUser is the entire object
      console.log(theUser.username);

    //Loop over the merch array
    for (var i = 0; i < merch.length; i++) {
      merch[i].user = theUser.username;  //if you crazily wanted to display password instead, theUser.password
    }

    console.log('merch',merch);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get merch list");
    } else {
      res.render("merchlist", {
        title: "List of merch",
        message: "Just look at what you've been up to here," + " " + theUser.username + "...",
        welcome: "Welcome, film fan!",
        merch: merch
      });
    }
  });
};


/* GET users listing/Handle request for merch form */
app.get("/merchlist", function(req, res) {
  console.log('hit merchlist');
  res.render("merchlist");
});

// C. Handle a GET request from the client to /merch enter/list
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
    title: 'Enter a New Item to Sell',
    themerch: {
      title: '',
      size: '',
      price: '',
      endDate: ''
    }
  })
})


// G. Handle a POST request from the client to /movieenter
app.post('/', function (req, res, next) {

  // User is editing an existing item
  if (req.body.db_id !== "") {

    // Find it
    TheMerch.findOne({ _id: req.body.db_id }, function (err, foundmerchenter) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundmerchenter.title = req.body.title;
        foundmerchenter.director = req.body.director;
        foundmerchenter.theater = req.body.theater;
        foundmerchenter.moviegoers = req.body.fellow_moviegoers;
        foundmerchenter.rating = req.body.rating;
        foundmerchenter.genre = req.body.genre;
        foundmerchenter.date_seen = req.body.date_seen;
        foundmerchenter.favorite = (req.body.favorite) ? req.body.favorite : false;

        // Save the updated item.
        foundmerchenter.save(function (err, newOne) {
          if (err) {
            sendError(req, res, err, "Could not save task with updated information");
          } else {
            res.render('/merchy/list');
          }
        });
      }
    });

  // User created a new item
  } else {

    // Who is the user?
    var theUser = UserController.getCurrentUser();

    // What did the user enter in the form?
    var theFormPostData = req.body
    theFormPostData.user = theUser._id;

    console.log('theFormPostData',theFormPostData);


    var mymerch = new TheMerch(theFormPostData);

    mymerch.save(function (err, mymerch) {
      if (err) {
        sendError(req, res, err, "Failed to save task");
      } else {
        res.redirect('/merchy/list');
      }
    });
  }
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

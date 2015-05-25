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
      res.render("merchList", {
        title: "List of merch",
        message: "Just look at what you've been up to here," + " " + theUser.username + "...",
        welcome: "Welcome, seller!",
        merchLength: merching.length,
        merching: merching
      });
    }
  });
};


// C. Handle a GET request from the client to /merchy/list
app.get("/list", function(req, res, next) {
  console.log('hit merchlist');
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
    merch: {
      _id: '',
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

  //User is editing an existing item
  if (req.body.db_id !== "") {

    // Find it
    TheMerch.findOne({ _id: req.body.db_id }, function (err, foundTheMerch) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundTheMerch.title = req.body.title;
        foundTheMerch.size = req.body.size;
        foundTheMerch.price = req.body.price;
        foundTheMerch.endDate = req.body.endDate;

        // Save the updated item.
        foundTheMerch.save(function (err, newOne) {
          if (err) {
            sendError(req, res, err, "Could not save task with updated information");
          } else {
            res.redirect('/merchy/list');
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

    console.log('theFormPostData **** Showing reception of data ***** ',theFormPostData);


    var mymerch = new TheMerch(theFormPostData);

    mymerch.save(function (err, mymerch) {
      console.log(mymerch, '***this is form data saving')
      if (err) {
        sendError(req, res, err, "Failed to save task");
      } else {
        res.redirect('/merchy/list');
      }
    });
   }
});


app.delete('/', function (req, res) {
  console.log(req.body.merch_id);
  TheMerch.find({ _id: req.body.merch_id })
      .remove(function (err) {
        console.log("*****removed some merch******")
        console.log("req.body")
    // Was there an error when removing?
    if (err) {
      sendError(req, res, err, "Could not delete the merch item");

    // Delete was successful
    } else {
      res.send("SUCCESS");
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
        merch: thisMerch
      });
    }
  });
});

module.exports = app;

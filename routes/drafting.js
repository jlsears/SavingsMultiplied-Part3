// Retrieve all merch for the current user
var getUserMerch = function (userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  Merch.find({user: userId}, function (err, movies) {
    if (!err) {
      console.log('Merch found = ' + merch.length);
      console.log('No errors when looking up movies. Resolve the promise (even if none were found).');
      deferred.resolve(movies);
    } else {
      console.log('There was an error looking up movies. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


*******

 if (req.body.db_id !== "") {

    // Find it
    TheMerch.findOne({ _id: req.body.db_id }, function (err, foundmerchenter) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundmerchenter.title = req.body.title;
        foundmerchenter.price = req.body.price;
        foundmerchenter.size = req.body.size;
        foundmerchenter.endDate = req.body.endDate;

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

  }

  *******

          input#title(type='hidden', name='db_id', value='#{TheMerch._id}')

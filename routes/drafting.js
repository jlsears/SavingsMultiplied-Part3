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
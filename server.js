var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var shortURLPromise, short = require('short');

short.connect('mongodb://localhost:27017/short');

short.connection.on('error', function(error) {
  // throw new Error(error);
  console.log(error)
});



app.get('*', function(req,res){
  //fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var url = req.originalUrl.replace(/\//, '')

  //test if valid url
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (url.match(regex)){

    var shortURLPromise = short.generate({
      URL: url
    });
    shortURLPromise.then(function(mongodbDoc) {
      console.log('>> created short URL:');
      console.log(mongodbDoc);
      console.log('>> retrieving short URL: %s', mongodbDoc.hash);
      short.retrieve(mongodbDoc.hash).then(function(result) {
        console.log('>> retrieve result:');
        console.log(result);
        process.exit(0);
      }, function(error) {
        if (error) {
          console.log(error)
        }
      });
    }, function(error) {
      if (error) {
        console.log(error)
      }
    });
    var returnObj = {
      "original_url": url,
      "short_url": result.hash
    }
    res.send(returnObj)
  } else {
    res.send({error: "Invalid URL"})
  }

});


var port = process.env.PORT || 8080;

app.listen(port);
console.log("Express listening on port...")



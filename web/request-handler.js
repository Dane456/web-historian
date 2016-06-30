var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!


var actions = {
  GET: function(request, response) {

    if (request.url === '/' || request.url === '/styles.css') {
      helpers.checkValidExtension(request, response);

    } else {
      var inList = archive.isUrlArchived(request.url)
      .catch(function(error) { helpers.sendResponse(response, 'NAT FOWND', 404); })
      .then(function(exists) {
              
        fs.readFile(archive.paths.archivedSites + request.url, 'utf-8', function(err, data) {

          if (err) {
            console.log('Error : ', err);
            return;
          }
          console.log('url found data: ', data);
          helpers.sendResponse(response, data);

        });
      });
    }

  },
  POST: function(request, response) {
    console.log('Post');
    var body = '';
    request.on('data', function(chunk) {
      body += chunk;
    });
    request.on('end', function() {
      // console.log('body: ', body.slice(4));
      archive.addUrlToList(body.slice(4), function(err) {
        var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
        console.log('fileContents:' + fileContents + ' typeof' + typeof fileContents);
      });
      // console.log(archive.readListOfUrls, function));
      helpers.sendResponse(response, '{}', 302);
    });
  },
  OPTIONS: function(request, response) {
    helpers.sendResponse(response, 'null');
  }
};


exports.handleRequest = function (req, res) {
  console.log('Serving request type ' + req.method + ' for request url ' + req.url);
  if (actions[req.method]) {
    actions[req.method](req, res);
  } else {
    helpers.sendResponse(response, 'NAT FOWND', 404);
  }
  //res.end(archive.paths.list);
};

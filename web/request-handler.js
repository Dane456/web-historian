var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');
var requestData = require('request');
var fetch = require('../workers/htmlfetcher.js');
// require more modules/folders here!


var actions = {
  GET: function(request, response) {
    archive.downloadUrls();

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
    // console.log('Post');
    var body = '';
    request.on('data', function(chunk) {
      body += chunk;
    });
    request.on('end', function() {
      var url = body.slice(4);
      // console.log('body.slice(4): ', url);
      archive.isUrlArchived(url)
      .then(function() {
        fs.readFile(archive.paths.archivedSites + '/' + url, 'utf-8', function(err, data) {
          if (err) {
            // console.log('Error : ', err);
            return;
          }
          helpers.headers['Content-Type'] = 'text/html';
          helpers.sendResponse(response, data);

        });
      })
      .catch(function() {
        console.log('addUrlToList: ', url);
        archive.addUrlToList(url);
        //show loading.html
        fs.readFile(archive.paths.loading, 'utf-8', function(err, data) {
          if (err) {
            // console.log('Error : ', err);
            return;
          }
          helpers.headers['Content-Type'] = 'text/html';
          helpers.sendResponse(response, data);

        });
      });
      // .then(function(){
      //   archive.readListOfUrls().then(function(urls){
      //     archive.downloadUrls(urls);
      //   })
      // });

      //Standard post response
      // helpers.sendResponse(response, '{}', 302);
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

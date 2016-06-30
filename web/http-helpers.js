var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!

var validExtensions = {
  '.json' : 'application/json',
  '.html' : 'text/html',      
  '.js': 'application/javascript', 
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.png': 'image/png'
};

exports.readFile = function(filepath, response, ext) {
  fs.readFile(filepath, 'utf-8', function(err, data) {
    if (err) {
      exports.sendResponse(response, JSON.stringify(err), 404);
      return;
    }
    var fullExt = ext || '.com';
    exports.headers['Content-Type'] = validExtensions[ext];
    exports.sendResponse(response, data); 
  }); 
};

exports.checkValidExtension = function(request, response) {

  console.log('checkValidExtension: ', request.url);
  if (request.url === '/') {
    var filename = '/index.html'; 
  } else {
    var filename = request.url;
  }
  var ext = path.extname(filename);
  var localPath = __dirname; 
  var isValidExt = validExtensions[ext];

  if (isValidExt) {
    //hard-coded for index.html
    var filepath = archive.paths.index;
    console.log('filepath: ', filepath);
    exports.readFile(filepath, response, ext);
  }
  
};

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};


var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var helpers = require('../web/http-helpers.js');
var Promise = require('bluebird');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  style: path.join(__dirname, '../web/public/styles.css')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
    if (err) { 
      console.log('readListOfUrls no data');
      return;
    }
    // console.log('readListOfUrls data: ' +  data + ' type: ' + typeof data);
    return callback(data.split('\n'));

  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(data) {
    for (item of data) {
      if (item === url) {
        console.log('item:', item);
        return callback(true);
      }
    }
    return callback(false);
  });

};

exports.addUrlToList = function(url, callback) {
  var addition = url + '\n';
  fs.appendFile(exports.paths.list, addition, callback);
};

exports.isUrlArchived = function(fileURL) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path.join(exports.paths.archivedSites, fileURL), 'utf-8', function(err, data) {
      if (err) {
        reject(false);
      }
      resolve(true);

    });     
  });
};

exports.downloadUrls = function() {
};

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');

new CronJob('*/5 * * * * *', function() {
  archive.downloadUrls();
  //clear list
  //fs.writeFile(archive.paths.list, '', function() { console.log('items deleted'); } ); 
}, function() {
  console.log('downloads complete');
}, true, 'America/Los_Angeles');


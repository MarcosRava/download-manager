/*jslint node: true */
"use strict";

var download = require('./src/download-manager');
/*var urls = ['http://download.gimp.org/pub/gimp/v2.8/windows/gimp-2.8.14-setup-1.exe',
           'http://www.win-rar.com/fileadmin/winrar-versions/winrar/wrar521.exe'];

for (var i in urls) {
  var url = urls[i];
  download(url, __dirname)
  .then(function(data) {
    console.log('code: ', data)
  })
  .progress(function(data) {
    //console.log('progress: ' + data.percent + ' ' + data.file + ' ' + data.speed)
  })
  .fail(function(data) {
    console.log('code error: ', data)
  })
}*/
module.exports = download;
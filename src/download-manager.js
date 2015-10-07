/*jslint node: true */

var fs, config, path, newLine, util, Q, deferred, radix, exitStatus;

Q = require('q');
util = require('util');
path = require('path');
exitStatus = require('./wget-exit-status.json');
deferred = Q.defer();
radix = 10;
newLine = process.platform.indexOf('win') !== -1 ? "\033[0G" : "\r";

function download(url, dir) {
  var spawn, directory, wgetParams, wget, length, indexOfPcent,
    percent, speed, d, file;
  spawn = require('child_process').spawn;
  directory = path.resolve(dir);
  wgetParams = [ '--directory-prefix=' + directory, '--continue', url];
  wgetParams.push('--trust-server-names');
//  if (config.limitRate) {
//    wgetParams.push('--limit-rate=' + config.limitRate);
//  }
  wget = spawn('wget', wgetParams);
  wget.stderr.on('data', function (data, code) {
    d = data.toString();
    if (d.indexOf('Saving to:') !== -1) {
      file = d.substring(d.lastIndexOf('/') + 1, d.lastIndexOf('\''));
    }
    if (d.indexOf('Length:') !== -1) {
      length = parseInt(d.substring(d.indexOf(': ') + 2, d.indexOf(' (')), radix);
    }
    if (d.indexOf('% ') !== -1) {
      indexOfPcent = d.indexOf('%');
      percent = d.substring(indexOfPcent - 3, indexOfPcent + 1);
      speed = d.substring(indexOfPcent + 2, indexOfPcent + 7);
      process.stdout.write(file + ': ' + percent + ' ' + speed + newLine);
      //process.stdout.write(d);
      deferred.notify({percent: percent, speed: speed, url: url, file: file, directory: directory});
      if (percent.trim() === '100%') {
        
      //finished
      }

    }
    if (d.indexOf('The file is already fully retrieved') !== -1) {
      //finished
    }
  });
  wget.on('exit', function (code) {
    var result = {code: code, msg: exitStatus[code]};
    console.log('Child process exited with exit code', result.code, result.msg);
    if (code === 0) {
      deferred.resolve(result);
    } else {
      deferred.reject(result);
    }
  });
  
  return deferred.promise;
}

module.exports = download;
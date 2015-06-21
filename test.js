var fs = require('fs');
var rimraf = require('rimraf');

// Reset data
rimraf.sync('./test/dest');
fs.mkdirSync('./test/dest');
rimraf.sync('./test/finish');
fs.mkdirSync('./test/finish');

var srcPath = './test/src/';

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push(files[i]);
    }
  }
  return files_;
}

var cfs = require('./main')({
  algorithm: 'aes-256-ctr',
  password: '1234',
  root: './test/dest'
});

var files = getFiles(srcPath);

files.forEach(function(file) {
  var data = fs.readFileSync(srcPath + file);
  cfs.writeFileSync(file, data);
});

files.forEach(function(file) {
  var data2 = cfs.readFileSync(file);
  fs.writeFileSync('./test/finish/' + file, data2);
});
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
  root: './test/dest',
  enhanced: true
});

var files = getFiles(srcPath);

files.forEach(function(file, index) {
  cfs.mkdirSync('' + index);
  var data = fs.readFileSync(srcPath + file);
  cfs.writeFileSync(index + '/' + file, data);
});

files.forEach(function(file, index) {
  var srcFile = cfs.createReadStream(index + '/' + file);
  var destFile = fs.createWriteStream('./test/finish/' + file);
  srcFile.pipe(destFile);
});
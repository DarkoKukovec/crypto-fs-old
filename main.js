var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  options = options || false;

  // algorithm, password
  var crypto = require('./crypto.js')(options);

  // root directory
  var rootPath = options.root || './';
  var prefix = options.prefix === false ? '' : (options.prefix || 'cfs_');

  // filemap path
  var fileMap;
  if (options.filemap) {
    var fileMapFile = options.filemap;
    fileMap = require('./filemap')(rootPath, fileMapFile, options.every, prefix, crypto);
  } else {
    fileMap = require('./filename')(rootPath, prefix, crypto);
  }

  function getPath(file) {
    var name = fileMap.add(file);
    return path.normalize(rootPath + '/' + name);
  }

  function decryptCb(cb) {
    return function (err, data) {
      if (err) cb(err, null);
      else cb(err, crypto.decryptBuffer(data));
    };
  };

  function reverseFilenameMap(folder) {
    return function(fileName) {
      var filePath = path.normalize(fileMap.add(folder) + '/' + fileName);
      var file = fileMap.reverseGet(filePath);
      return file.split('/').pop();
    };
  }

  return Object.freeze({
    readFileSync: function(file) {
      var filePath = getPath(file);
      var data = fs.readFileSync(filePath);
      return crypto.decryptBuffer(data);
    },
    readFile: function(file, cb) {
      var filePath = getPath(file);
      fs.readFileSync(filePath, decryptCb(cb));
    },

    writeFileSync: function(file, data) {
      var filePath = getPath(file);
      data = crypto.encryptBuffer(data);
      return fs.writeFileSync(filePath, data);
    },
    writeFile: function(file, data, cb) {
      var filePath = getPath(file);
      data = crypto.encryptBuffer(data);
      fs.writeFileSync(filePath, data, cb);
    },

    stat: function(file, cb) {
      var filePath = getPath(file);
      fs.stat(filePath, cb);
    },
    statSync: function(file) {
      var filePath = getPath(file);
      return fs.statSync(filePath);
    },

    mkdir: function(folder, cb) {
      var folderPath = getPath(folder);
      fs.mkdir(folderPath, cb);
    },
    mkdirSync: function(folder) {
      var folderPath = getPath(folder);
      return fs.mkdirSync(folderPath);
    },

    // TODO: Handle the case when removal fails (e.g. folder not empty)
    rmdir: function(folder, cb) {
      var folderPath = getPath(folder);
      fileMap.remove(folder);
      fs.rmdir(folderPath, cb);
    },
    rmdirSync: function(folder) {
      var folderPath = getPath(folder);
      fileMap.remove(folder);
      return fs.rmdirSync(folderPath);
    },

    unlink: function(file, cb) {
      var filePath = getPath(file);
      fileMap.remove(file);
      fs.unlink(filePath, cb);
    },
    unlinkSync: function(file) {
      var filePath = getPath(file);
      fileMap.remove(file);
      return fs.unlinkSync(filePath);
    },

    exists: function(file, cb) {
      var filePath = fileMap.get(file);
      fs.exists(filePath, cb);
    },
    existsSync: function(file) {
      var filePath = fileMap.get(file);
      return fs.existsSync(filePath);
    },

    rename: function(file, newFile, cb) {
      var filePath = getPath(file);
      var newFilePath = getPath(newFile);
      fileMap.remove(file);
      fs.rename(filePath, newFile, cb);
    },
    renameSync: function(file, newFile) {
      var filePath = getPath(file);
      var newFilePath = getPath(newFile);
      fileMap.remove(file);
      return fs.renameSync(filePath, newFile);
    },

    readdir: function(folder, cb) {
      var folderPath = getPath(folder);
      fs.readdir(folderPath, function(err, data) {
        if (err) {
          cb(err, null);
        } else {
          cb(err, data.map(reverseFilenameMap(folder)));
        }
      });
    },
    readdirSync: function(folder, cb) {
      var folderPath = getPath(folder);
      var data = fs.readdirSync(folderPath);
      return data.map(reverseFilenameMap(folder));
    },

    saveMap: fileMap && fileMap.save
    // createReadStream
    // createWriteStream
    // ReadStream
    // rimraf
  });
};
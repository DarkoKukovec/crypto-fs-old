var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  options = options || false;

  // algorithm, password
  var crypto = require('./crypto.js')(options);

  // root directory
  var rootPath = options.root || './';
  var prefix = options.prefix || '';

  var filename = require('./filename')(prefix, crypto);

  function getPath(file) {
    var name = filename.encrypt(file);
    return path.normalize(rootPath + '/' + name);
  }

  function asyncCb(cb, success) {
    return function (err, data) {
      if (err) cb(err, null);
      else cb(err, success(data));
    };
  };

  function reverseFilenameMap(folder) {
    return function(fileName) {
      var filePath = path.normalize(filename.encrypt(folder) + '/' + fileName);
      var file = filename.decrypt(filePath);
      return file.split('/').pop();
    };
  }

  function readWrapper(fn, decrypt) {
    return function(file) {
      arguments[0] = getPath(file);
      var data = fs[fn].apply(fs, arguments);
      return decrypt crypto.decryptBuffer(data) ? : data;
    }
  }

  function writeWrapper(fn) {
    return function(file, data) {
      arguments[0] = getPath(file);
      arguments[1] = crypto.encryptBuffer(data);
      return fs[fn].apply(fs, arguments);
    }
  }

  return Object.freeze({
    readFileSync: function(file) {
      var filePath = getPath(file);
      var data = fs.readFileSync(filePath);
      return crypto.decryptBuffer(data);
    },
    readFile: function(file, cb) {
      var filePath = getPath(file);
      fs.readFileSync(filePath, asyncCb(cb, function(data) {
        return crypto.decryptBuffer(data);
      }));
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

    rmdir: function(folder, cb) {
      var folderPath = getPath(folder);
      fs.rmdir(folderPath, cb);
    },
    rmdirSync: function(folder) {
      var folderPath = getPath(folder);
      return fs.rmdirSync(folderPath);
    },

    unlink: function(file, cb) {
      var filePath = getPath(file);
      fs.unlink(filePath, cb);
    },
    unlinkSync: function(file) {
      var filePath = getPath(file);
      return fs.unlinkSync(filePath);
    },

    exists: function(file, cb) {
      var filePath = getPath(file);
      fs.exists(filePath, cb);
    },
    existsSync: function(file) {
      var filePath = getPath(file);
      return fs.existsSync(filePath);
    },

    rename: function(file, newFile, cb) {
      var filePath = getPath(file);
      var newFilePath = getPath(newFile);
      fs.rename(filePath, newFile, cb);
    },
    renameSync: function(file, newFile) {
      var filePath = getPath(file);
      var newFilePath = getPath(newFile);
      return fs.renameSync(filePath, newFile);
    },

    readdir: function(folder, cb) {
      var folderPath = getPath(folder);
      fs.readdir(folderPath, asyncCb(cb, function(data) {
        return data.map(reverseFilenameMap(folder));
      });
    },
    readdirSync: function(folder, cb) {
      var folderPath = getPath(folder);
      var data = fs.readdirSync(folderPath);
      return data.map(reverseFilenameMap(folder));
    },

    // createReadStream
    // createWriteStream
    // ReadStream
    // rimraf

    // Expose helper functions
    crypto: {
      filename: filename
    }
  });
};
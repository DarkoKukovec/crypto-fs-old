var path = require('path');
var fs = require('fs');

module.exports = function(rootPath, filename, enhanced, crypto) {

  var utils = {
    getPath: function(file) {
      var name = filename.encrypt(file);
      return path.normalize(rootPath + '/' + name);
    },

    asyncCb: function(cb, success) {
      return function (err, data) {
        if (err) cb(err, null);
        else cb(err, success(data));
      };
    },

    reverseFilenameMap: function(folder) {
      return function(fileName) {
        var filePath = path.normalize(filename.encrypt(folder) + '/' + fileName);
        var file = filename.decrypt(filePath);
        return file.split('/').pop();
      };
    },

    readAsyncWrapper: function(fn) {
      return function(file) {
        arguments[0] = utils.getPath(file);
        var cb = arguments[arguments.length - 1];
        arguments[arguments.length - 1] = utils.asyncCb(cb, function(data) {
          return crypto.decryptBuffer(data, enhanced && file);
        });
        fs[fn].apply(fs, arguments);
      };
    },

    readSyncWrapper: function(fn, decrypt) {
      return function(file) {
        arguments[0] = utils.getPath(file);
        var data = fs[fn].apply(fs, arguments);
        return crypto.decryptBuffer(data, enhanced && file);
      };
    },

    fsWrapper: function(fn, noEnhanced) {
      return function(file) {
        if (noEnhanced && enhanced) {
          throw new Exception('Operation not supported in the enhanced security mode');
        } else {
          arguments[0] = utils.getPath(file);
          return fs[fn].apply(fs, arguments);
        }
      };
    },

    writeWrapper: function(fn) {
      return function(file, data) {
        var fileName = file;
        arguments[0] = utils.getPath(file);
        arguments[1] = crypto.encryptBuffer(data, enhanced && fileName);
        return fs[fn].apply(fs, arguments);
      };
    }
  };

  return utils;
};
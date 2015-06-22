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
  var utils = require('./utils')(rootPath, filename, crypto);

  return Object.freeze({
    readFile: utils.readAsyncWrapper('readFile'),
    readFileSync: utils.readSyncWrapper('readFileSync', true),

    writeFile: utils.writeWrapper('writeFile'),
    writeFileSync: utils.writeWrapper('writeFileSync'),

    stat: utils.fsWrapper('stat'),
    statSync: utils.fsWrapper('statSync'),

    mkdir: utils.fsWrapper('mkdir'),
    mkdirSync: utils.fsWrapper('mkdirSync'),

    rmdir: utils.fsWrapper('rmdir'),
    rmdirSync: utils.fsWrapper('rmdirSync'),

    unlink: utils.fsWrapper('unlink'),
    unlinkSync: utils.fsWrapper('unlinkSync'),

    exists: utils.fsWrapper('exists'),
    existsSync: utils.fsWrapper('existsSync'),

    rename: function(file, newFile, cb) {
      var filePath = utils.getPath(file);
      var newFilePath = utils.getPath(newFile);
      fs.rename(filePath, newFile, cb);
    },
    renameSync: function(file, newFile) {
      var filePath = utils.getPath(file);
      var newFilePath = utils.getPath(newFile);
      return fs.renameSync(filePath, newFile);
    },

    readdir: function(folder, cb) {
      var folderPath = utils.getPath(folder);
      fs.readdir(folderPath, utils.asyncCb(cb, function(data) {
        return data.map(utils.reverseFilenameMap(folder));
      }));
    },
    readdirSync: function(folder, cb) {
      var folderPath = utils.getPath(folder);
      var data = fs.readdirSync(folderPath);
      return data.map(utils.reverseFilenameMap(folder));
    },

    // createReadStream
    // createWriteStream
    // ReadStream
    // rimraf

    // Expose helper functions
    crypto: {
      crypto: crypto,
      filename: filename
    }
  });
};
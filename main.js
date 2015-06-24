var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  options = options || false;

  // algorithm, password, iv
  var crypto = require('./crypto.js')(options);

  // root directory
  var rootPath = options.root || './';
  var prefix = options.prefix || '';
  var enhanced = !!options.enhanced;

  var filename = require('./filename')(prefix, enhanced, crypto);
  var utils = require('./utils')(rootPath, filename, enhanced, crypto);

  var cfs =  Object.freeze({
    readFile: utils.readAsyncWrapper('readFile'),
    readFileSync: utils.readSyncWrapper('readFileSync', true),

    writeFile: utils.writeWrapper('writeFile'),
    writeFileSync: utils.writeWrapper('writeFileSync'),

    stat: utils.fsWrapper('stat'),
    statSync: utils.fsWrapper('statSync'),

    mkdir: utils.fsWrapper('mkdir'),
    mkdirSync: utils.fsWrapper('mkdirSync'),

    rmdir: utils.fsWrapper('rmdir', true),
    rmdirSync: utils.fsWrapper('rmdirSync', true),

    unlink: utils.fsWrapper('unlink'),
    unlinkSync: utils.fsWrapper('unlinkSync'),

    exists: utils.fsWrapper('exists'),
    existsSync: utils.fsWrapper('existsSync'),

    rename: function(file, newFile, cb) {
      var filePath = utils.getPath(file);
      var newFilePath = utils.getPath(newFile);
      if (enhanced) {
        cfs.readFile(file, function(err, data) {
          if (err) {
            return cb(err, null);
          }
          cfs.writeFile(newFile, data, cb);
        });
      } else {
        return fs.rename(filePath, newFile, cb);
      }
    },
    renameSync: function(file, newFile) {
      var filePath = utils.getPath(file);
      var newFilePath = utils.getPath(newFile);
      if (enhanced) {
        cfs.writeFileSync(newFile, cfs.readFileSync(file));
      } else {
        return fs.rename(filePath, newFile, cb);
      }
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

    createReadStream: function(file, fsOptions) {
      fsOptions = fsOptions || {};
      var filePath = utils.getPath(file);
      var encoding = typeof(fsOptions.encoding) == 'string' ? fsOptions.encoding : null;
      fsOptions.encoding = 'binary';

      var fstream = fs.createReadStream(filePath, fsOptions);
      var cstream = crypto.getDecryptStream(encoding, enhanced && file);

      return fstream.pipe(cstream);
    },

    createWriteStream: function(file, fsOptions) {
      fsOptions = fsOptions || {};
      var filePath = utils.getPath(file);
      var encoding = typeof(fsOptions.encoding) == 'string' ? fsOptions.encoding : null;
      fsOptions.encoding = 'binary';

      var fstream = fs.createWriteStream(filePath, fsOptions);
      var cipher = crypto.getCipher(options, enhanced && file);

      fstream.cryptoWrite = fstream.write;
      fstream.cryptoEnd = fstream.end;
      fstream.write = function (data, encoding, fd) {
        this.cryptoWrite(cipher.update(data, encoding, 'binary'), 'binary', fd);
      };
      fstream.end = function (data, encoding) {
        if (data) {
          this.cryptoWrite(cipher.update(data, encoding, 'binary'), 'binary');
        }
        this.cryptoWrite(cipher.final(), 'binary');
        this.cryptoEnd();
      };

      return fstream;
    },

    // ReadStream
    // rimraf

    // Expose helper functions
    crypto: {
      crypto: crypto,
      filename: filename
    }
  });

  return cfs;
};
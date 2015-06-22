var crypto = require('crypto');
var buffer = require('buffer').Buffer;

var cryptostream = require('./cryptostream');
var DecryptStream = cryptostream.DecryptStream;

module.exports = function(options) {
  var cryptoObj = {
    getCipher: function(options) {
      if (options.iv) {
        return crypto.createCipheriv(options.algorithm, options.password, options.iv);
      } else {
        return crypto.createCipher(options.algorithm, options.password);
      }
    },
    getDecipher: function(options) {
      if (options.iv) {
        return crypto.createDecipheriv(options.algorithm, options.password, options.iv);
      } else {
        return crypto.createDecipher(options.algorithm, options.password);
      }
    },

    encryptBuffer: function(data) {
      var cipher = cryptoObj.getCipher(options);
      var crypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return crypted;
    },

    decryptBuffer: function(data) {
      var decipher = cryptoObj.getDecipher(options);
      var dec = Buffer.concat([decipher.update(data), decipher.final()]);
      return dec;
    },

    getDecryptStream: function(options, encoding) {
      return new DecryptStream({
        decipher: cryptoObj.getDecipher(options),
        inputEncoding: 'binary',
        outputEncoding: encoding
      });
    }
  }
  return cryptoObj;
};

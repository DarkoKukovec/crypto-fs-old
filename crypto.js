var crypto = require('crypto');
var buffer = require('buffer').Buffer;

var CryptoStream = require('./cryptostream');

module.exports = function(options) {
  var cryptoObj = {
    getCipher: function(options, preKey) {
      var password = options.password + (preKey ? '/' + preKey : '');
      if (options.iv) {
        return crypto.createCipheriv(options.algorithm, password, options.iv);
      } else {
        return crypto.createCipher(options.algorithm, password);
      }
    },

    getDecipher: function(options, preKey) {
      var password = options.password + (preKey ? '/' + preKey : '');
      if (options.iv) {
        return crypto.createDecipheriv(options.algorithm, password, options.iv);
      } else {
        return crypto.createDecipher(options.algorithm, password);
      }
    },

    encryptBuffer: function(data, preKey) {
      var cipher = cryptoObj.getCipher(options, preKey);
      var crypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return crypted;
    },

    decryptBuffer: function(data, preKey) {
      var decipher = cryptoObj.getDecipher(options, preKey);
      var dec = Buffer.concat([decipher.update(data), decipher.final()]);
      return dec;
    },

    getDecryptStream: function(encoding, preKey, debug) {
      return new CryptoStream({
        inputEncoding: 'binary',
        outputEncoding: encoding
      }, cryptoObj.getDecipher(options, preKey), debug);
    }
  }
  return cryptoObj;
};

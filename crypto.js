var crypto = require('crypto');
var buffer = require('buffer').Buffer;

module.exports = function(options) {
  return {
    encryptBuffer: function(data) {
      var cipher;
      if (options.iv) {
        cipher = crypto.createCipheriv(options.algorithm, options.password, options.iv);
      } else {
        cipher = crypto.createCipher(options.algorithm, options.password);
      }
      var crypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return crypted;
    },

    decryptBuffer: function(data) {
      var decipher;
      if (options.iv) {
        decipher = crypto.createDecipheriv(options.algorithm, options.password, options.iv);
      } else {
        decipher = crypto.createDecipher(options.algorithm, options.password);
      }
      var dec = Buffer.concat([decipher.update(data), decipher.final()]);
      return dec;
    }
  }
};

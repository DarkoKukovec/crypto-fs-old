var crypto = require('crypto');
var buffer = require('buffer').Buffer;

module.exports = function(options) {
  return {
    encryptBuffer: function(data) {
      var cipher = crypto.createCipher(options.algorithm, options.password);
      var crypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return crypted;
    },

    decryptBuffer: function(data) {
      var decipher = crypto.createDecipher(options.algorithm, options.password);
      var dec = Buffer.concat([decipher.update(data), decipher.final()]);
      return dec;
    }
  }
};

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
    },

    encrypt: function(data) {
      var cipher = crypto.createCipher(options.algorithm, options.password);
      var crypted = cipher.update(data, 'utf8', 'hex');
      crypted += cipher.final('hex');
      return crypted;
    },
    decrypt: function(data) {
      var decipher = crypto.createDecipher(options.algorithm, options.password);
      var dec = decipher.update(data, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    },
    
    hash: function(str) {
      var shasum = crypto.createHash('sha1');
      shasum.update(str);
      return shasum.digest('hex');
    }
  }
};

var Buffer = require('buffer').Buffer;

module.exports = function(prefix, crypto) {

  function encrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return prefix + crypto.encryptBuffer(name).toString('hex');
    }).join('/');
  }

  function decrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return crypto.decrypt(new Buffer(name, 'hex')).toString();
    }).join('/');
  }

  return {
    encrypt: encrypt,
    get: function(filePath) {
      if (['.', '..'].indexOf(filePath) === -1) {
        return encrypt(filePath);
      } else {
        return filePath;
      }
    },
    decrypt: decrypt
  }
};
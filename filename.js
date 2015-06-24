var Buffer = require('buffer').Buffer;

module.exports = function(prefix, enhanced, crypto) {

  function encrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return prefix + crypto.encryptBuffer(name).toString('hex');
    }).join('/');
  }

  function decrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return crypto.decryptBuffer(new Buffer(name.slice(prefix.length), 'hex')).toString();
    }).join('/');
  }

  function enhancedEncrypt(filePath) {
    var preKey = '';
    return filePath.split('/').map(function(name) {
      var data =  prefix + crypto.encryptBuffer(name, preKey).toString('hex');
      preKey += name + '/';
      return data;
    }).join('/');
  }

  function enhancedDecrypt(filePath) {
    var preKey = '';
    return filePath.split('/').map(function(name) {
      var data = crypto.decryptBuffer(new Buffer(name.slice(prefix.length), 'hex'), preKey).toString();
      preKey += data + '/';
      return data;
    }).join('/');
  }

  return enhanced ? {
    encrypt: enhancedEncrypt,
    decrypt: enhancedDecrypt
  } : {
    encrypt: encrypt,
    decrypt: decrypt
  }
};
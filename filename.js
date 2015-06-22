module.exports = function(prefix, crypto) {

  function encrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return prefix + crypto.encrypt(name);
    }).join('/');
  }

  function decrypt(filePath) {
    return filePath.split('/').map(function(name) {
      return crypto.decrypt(name.slice(4));
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
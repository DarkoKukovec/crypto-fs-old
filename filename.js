module.exports = function(rootPath, prefix, crypto) {

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
    add: encrypt,
    remove: function() {},
    get: function(filePath) {
      if (['.', '..'].indexOf(filePath) === -1) {
        return encrypt(filePath);
      } else {
        return filePath;
      }
    },
    reverseGet: decrypt
  }
};
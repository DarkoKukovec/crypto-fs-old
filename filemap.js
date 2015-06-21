var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(rootPath, fileMapName, every, prefix, crypto) {
  var mapFilePath = path.normalize(rootPath + '/' + fileMapName);
  var map = {}, inverted = {};
  if (fs.existsSync(mapFilePath)) {
    var mapData = fs.readFileSync(mapFilePath);
    map = JSON.parse(crypto.decryptBuffer(mapData));
    inverted = _.invert(map);
  }

  function saveMap(force) {
    if (every || force) {
      var mapData = crypto.encryptBuffer(JSON.stringify(map));
      inverted = _.invert(map);
      fs.writeFileSync(mapFilePath, mapData);
    }
  }

  function getEncFile(filePath, folder) {
    var pathFragments = filePath.split('/');
    var folderPath = '';
    var rawFolderPath = '';

    if (!folder) {
      var folderPath = '';
      if (pathFragments.length > 1) {
        pathFragments.pop();
        folderPath = getEncFile(pathFragments.join('/'), true) + '/';
      }
    } else {
      for (var i = 0; i < pathFragments.length - 1; i++) {
        rawFolderPath += pathFragments[i];
        folderPath += getEncFile(rawFolderPath, true) + '/';
        rawFolderPath += '/';
      }
    }

    return path.normalize(folderPath + prefix + crypto.hash(filePath));
  }

  function reverseGet(file) {
    return inverted[file];
  }

  function getUnique(filePath) {
    var name = getEncFile(filePath);
    if (reverseGet(name)) {
      var index = 1;
      while(reverseGet(getEncFile(filePath + '-' + index))) index++;
      return getEncFile(filePath + '-' + index);
    }
    return name;
  }

  return {
    add: function(filePath) {
      if (!map[filePath]) {
        var newPath = getUnique(filePath);
        map[filePath] = newPath;
        inverted[newPath] = filePath;
        saveMap();
      }
      return map[filePath];
    },
    remove: function(filePath) {
      if (map[filePath]) {
        delete inverted[map[filePath]];
        delete map[filePath];
        saveMap();
      }
      return !map[filePath];
    },
    get: function(filePath) {
      // Check we have the file mapped, check if it exists, and then return the mapped filename
      return map[filePath] || filePath;
    },
    reverseGet: reverseGet,
    save: function() {
      saveMap(true);
    }
  }
};
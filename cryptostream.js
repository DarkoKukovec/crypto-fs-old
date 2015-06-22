var util = require('util');
var Stream = require('stream').Stream;

function CryptoStream(opts, cipher, debug) {
  this._debug = debug;
  this._cipher = cipher;
  this.inputEncoding = opts.inputEncoding;
  this.outputEncoding = opts.outputEncoding;
  this.readable = this.writable = true;
}

util.inherits(CryptoStream, Stream);

CryptoStream.prototype.write = function(data) {
  console.log(data.length, this._debug);
  this.emit('data', this._cipher.update(data, this.inputEncoding, this.outputEncoding));
  return true;
};

CryptoStream.prototype.end = function(data) {
  if (data) {
    this.write(data);
  }
  this.emit('data', this._cipher.final(this.outputEncoding));
  this.emit('end');
};

module.exports = CryptoStream;

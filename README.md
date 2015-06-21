# crypto-fs

Wrapper around node fs module that encrypts the files on the fly

## Usage

    var cfs = require('crypto-fs')({
      every: true, // Should the filemap be saved on every change
      algorithm: 'aes-256-ctr',
      password: '1234',
      root: './test/dest', // Root directory of the encrypted files
      filemap: 'filemap' // filename of the map file (saved in the root folder)
    });

If every is set to false, file map should be saved with ``cfs.saveMap();``.
Paths are always relative to the root folder.

## Implemented functions

* readFile
* writeFile
* stat
* mkdir
* rmdir
* unlink
* exists
* rename
* readdir

...and their Sync alternatives

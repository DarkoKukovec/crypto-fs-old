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

If filemap option is falsy, no filemap will be used. Instead, filenames will be encrypted with the same algorithm as the data. Advantage is that the filemap can't be corrupted and doesn't use any additional space. Disantvage is that the filename lenght isn't completly hidden.

## Example

``test.js`` file contains an example. To use it, create a test/src folder and put some files in it. Run ``node test`` and the result should be test/dest folder with encrypted files and filemap file and test/finish folder with the files decrypted again.

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

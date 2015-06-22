# crypto-fs

Wrapper around node fs module that encrypts the files on the fly

## Usage

    var cfs = require('crypto-fs')({
      algorithm: 'aes-256-ctr',
      prefix: '', // encrpted filename prefix.  Defaults to ``""``
      password: '1234',
      root: './test/dest', // Root directory of the encrypted files
    });

Paths are always relative to the root folder.

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

## Extra functions

* crypto
  * filename
    * encrypt - used for filename encryption
    * decrypt - used for filename decryption
  * crypto
    * encryptBuffer - main encryption function
    * decryptBuffer - main decryption function

## Note

* if the folder contains both encrypted and unencrypted files, readdir will break. This will be fixed in a future version.

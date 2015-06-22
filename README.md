# crypto-fs

Wrapper around node fs module that encrypts the files on the fly

## Usage

    var cfs = require('crypto-fs')({
      algorithm: 'aes-256-ctr', // Any algorithm supported by node.js crypto module
      prefix: '', // encrpted filename prefix, defaults to ''
      password: '1234', // Please don't use '1234' or 'password' as your password ;)
      root: './test/dest', // Root directory of the encrypted files, defaults to './' (current folder)
      iv: null // If initialization vector is given, Cipheriv will be used
    });

Paths are always relative to the root folder.

## Example

``test.js`` file contains an example. To use it, create a test/src folder and put some files in it. Run ``node test`` and the result should be test/dest folder with encrypted files and filemap file and test/finish folder with the files decrypted again.

## What is hidden, and what is not?

* Hidden
  * File content
  * Filename (but the filename lenght can be estimated)
* Not hidden
  * File size (but can be different by a few bytes, depending on the file and used algorithm)
  * Folder structure (except for the file and folder names)

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

* createReadStream
* createWriteStream

## Helper functions

* crypto
  * filename
    * encrypt - used for filename encryption
    * decrypt - used for filename decryption
  * crypto
    * encryptBuffer - main encryption function
    * decryptBuffer - main decryption function

## Known issues

* If the folder contains both encrypted and unencrypted files, readdir will break. This will be fixed in a future version.

## Attribution

* stream functionality based on [node-efs](https://github.com/kunklejr/node-efs)

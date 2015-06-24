# crypto-fs

Wrapper around node fs module that encrypts the files on the fly

## Usage

    var cfs = require('crypto-fs')({
      algorithm: 'aes-256-ctr', // Any algorithm supported by node.js crypto module
      prefix: '', // encrpted filename prefix, defaults to ''
      password: '1234', // Please don't use '1234' or 'password' as your password ;)
      root: './test/dest', // Root directory of the encrypted files, defaults to './' (current folder)
      iv: null, // If initialization vector is given, Cipheriv will be used
      enhanced: false // should the enhanced security mode be used, defaults to false
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

## Enhanced security
Looking at many binary file formats, they always start with the same few bytes. If the same key is used to encrypt those files, the encrypted filles will still share the frist few bytes and therefore be more vulnerable to breaking the key.
In order to make it harder, in the enhanced security mode, every file will have an additional protection. When the file is encrypted, its original filename will be added to the pasword and therefore make the password unique to that file.
Something similar is done with filenames (except for the files and folders in the root folder). Original name of the previous folders is added to the original password for extra security.

### Downside
This mode can't be used in all cases for the following reasons:
  * Every manual rename will break the code and the files will be useless
  * When a file is renamed using crypto-fs, it has to be decoded and encoded back which isn't practical for bigger files
  * Renaming of folders isn't currently supported. You should manually create a new folder and move all the files in it.

## Known issues

* If the folder contains both encrypted and unencrypted files, readdir will break. This will be fixed in a future version.

## Attribution

* stream functionality based on [node-efs](https://github.com/kunklejr/node-efs)

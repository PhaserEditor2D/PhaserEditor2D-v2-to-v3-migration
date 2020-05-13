# Phaser Editor 2D migration scripts

This repository contains scripts to migrate files from v2 to v3.

# Setup

* Install [NodeJS](https://nodejs.org/).
* Clone this repository.

# Migrating Asset Pack files

The pack files in v2 and v3 are very similar. The only difference is in the meta information.
To migrate a pack file v2 to v3, execute:

```bash
$ node migrate-pack-file.js path/to/asset-pack.json

```

It will create a new `asset-pack.v3.json` file in the same folder of the original file.

# Migrating Scene files

TODO


# Test files

The `test-files` folder contains v2 files you can use to test the scripts.

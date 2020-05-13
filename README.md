# Phaser Editor 2D migration scripts

This repository contains scripts to migrate files from v2 to v3.

# Setup

* Install [NodeJS](https://nodejs.org/).
* Clone this repository.
* Open a terminal and run `npm install` in the repository folder.

# Project layout

A project in v2 has a `Design` and `WebContent` folder. The `Design` folder is not part of the game, it is used only for tools like the Texture Packer Editor.

Don't include the `Design` folder in your Phaser Editor v3 project. Your v3 project should only include the files inside the `WebContent` folder. You can store the content of the `Design` folder outside the project and workspace.

# Migrating Asset Pack files

The pack files in v2 and v3 are very similar. The only difference is in the meta information.
To migrate a pack file v2 to v3, execute:

```bash
$ node migrate-pack-file.js path/to/asset-pack.json

```

It will create a new `asset-pack.v3.json` file in the same folder of the original file.

# Migrating Scene files

WIP

const fs = require("fs");
const path = require("path");
const process = require("process");
const { exit } = require("process");

const inputFile = process.argv[2];

if (!inputFile) {

    printHelp();
    exit();
}

const content = fs.readFileSync(inputFile);
const data = JSON.parse(content.toString());

data.meta = {
    "app": "Phaser Editor 2D - Asset Pack Editor",
    "contentType": "phasereditor2d.pack.core.AssetContentType",
    "url": "https://phasereditor2d.com",
    "version": 2
};

const inputFilePath = path.parse(inputFile);
const outputFile = path.join(inputFilePath.dir, inputFilePath.name + ".v3.json");

console.log("Writing to '" + outputFile + "'");

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

function printHelp() {

    console.log("Usage: node migrate-pack-file.js path/to/pack.json");
}
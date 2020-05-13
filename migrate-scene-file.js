const fs = require("fs");
const path = require("path");
const uuid4 = require("uuid4");
const process = require("process");

const inputFile = process.argv[2];

if (!inputFile) {

    printHelp();

    process.exit();
}

const content = fs.readFileSync(inputFile);

const inputData = JSON.parse(content.toString());

const outputData = {};

metadata();
sceneId();
sceneProperties();
displayList();
objectLists();

const outputContent = JSON.stringify(outputData, null, 2);
console.log(outputContent);

const inputFilePath = path.parse(inputFile);
const outputFile = path.join(inputFilePath.dir, inputFilePath.name + "_v3.scene");

console.log("Writing to '" + outputFile + "'");

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

// migration functions

function displayList() {

    const displayList = [];
    outputData.displayList = displayList;

    for (const objData of inputData.displayList.children) {

        const newObjData = {
            type: objData["-type"],
            id: objData["-id"]
        };

        variableComponent(objData, newObjData);
        transformComponent(objData, newObjData);
        textureComponent(objData, newObjData);
        tileSpriteObject(objData, newObjData);
        textContentComponent(objData, newObjData);
        textObjectComponent(objData, newObjData);
        bitmapObjectComponent(objData, newObjData);

        displayList.push(newObjData);
    }
}

function bitmapObjectComponent(oldData, newData) {

    const type = newData.type;

    if (type !== "BitmapText") {

        return;
    }

    newData.font = oldData.fontAssetKey;
    newData.fontSize = oldData.fontSize;
    newData.letterSpacing = oldData.letterSpacing;
}

function textObjectComponent(oldData, newData) {

    const type = newData.type;

    if (type !== "Text") {

        return;
    }

    for (const prop of [
        "fontFamily",
        "fontSize",
        "fontStyle",
        "color",
        "stroke",
        "strokeThickness",
        "backgroundColor",
        "align"
    ]) {

        newData[prop] = oldData[prop];
    }
}

function textContentComponent(oldData, newData) {

    if ("text" in oldData) {

        newData.text = oldData.text;
    }
}

function tileSpriteObject(oldData, newData) {

    const type = newData.type;

    if (type !== "TileSprite") {

        return;
    }

    for (const prop of [
        "width",
        "height",
        "tilePositionX",
        "tilePositionY",
        "tileScaleX",
        "tileScaleY"
    ]) {

        newData[prop] = oldData[prop];
    }
}

function textureComponent(oldData, newData) {

    const type = newData.type;

    switch (type) {

        case "Image":
        case "Sprite":
        case "TileSprite":

            newData.texture = {
                key: oldData.textureKey,
                frame: oldData.textureFrame === oldData.textureKey ? undefined : oldData.textureFrame
            };

            break;
        default:
            break;
    }
}

function transformComponent(oldData, newData) {

    newData.x = get(oldData, "x", 0);
    newData.y = get(oldData, "y", 0);
    newData.scaleX = get(oldData, "scaleX", 1);
    newData.scaleY = get(oldData, "scaleY", 1);
    newData.originX = get(oldData, "originX", 0.5);
    newData.originY = get(oldData, "originY", 0.5);
    newData.angle = get(oldData, "angle", 0);

    const type = newData.type;

    switch (type) {

        case "Image":
        case "Sprite":
        case "TileSprite":

            newData.texture = {
                key: oldData.textureKey,
                frame: oldData.textureFrame === oldData.textureKey ? undefined : oldData.textureFrame
            };

            break;
        default:
            break;
    }
}

function variableComponent(oldData, newData) {

    newData.label = oldData.variableName;

    if (oldData.variableField) {
        
        newData.scope = "PUBLIC";
    }
}

function objectLists() {

    const lists = [];
    outputData.lists = lists;

    if (inputData.groups) {

        for(const group of inputData.groups.children) {

            const list = {
                id: uuid4(),
                label: group.variableName,  
                objectIds: []              
            };

            if (group.children) {

                for(const child of group.children) {
                    
                    list.objectIds.push(child["-id"]);
                }
            }

            lists.push(list);
        }
    }
}

function sceneProperties() {

    outputData["sceneType"] = "SCENE";

    outputData.settings = {};

    outputData.settings.borderX = get(inputData, "borderX", 0);
    outputData.settings.borderY = get(inputData, "borderX", 0);
    outputData.settings.borderWidth = get(inputData, "borderWidth", 800);
    outputData.settings.borderHeight = get(inputData, "borderHeight", 600);

    outputData.settings.superClassName = get(inputData, "superClassName", "Phaser.Scene");
    outputData.settings.createMethodName = get(inputData, "createMethodName");
    outputData.settings.preloadMethodName = get(inputData, "preloadMethodName");

    outputData.settings.sceneKey = path.parse(inputFile).name;
}

function sceneId() {

    outputData["id"] = uuid4();
}

function metadata() {

    outputData.meta = {
        "app": "Phaser Editor 2D - Scene Editor",
        "url": "https://phasereditor2d.com",
        "contentType": "phasereditor2d.core.scene.SceneContentType"
    };
}


function get(data, prop, oldDefValue, newDefValue) {

    if (prop in data) {

        const val = data[prop];

        if (val === oldDefValue) {

            if (oldDefValue !== newDefValue) {

                return newDefValue;
            }

            return undefined;
        }

        return val;
    }

    return newDefValue;
}

function printHelp() {

    console.log("Usage: node migrate-scene-file.js path/to/Level.scene");
}
const path = require("path");
const fs = require("fs");
const inventory = path.join(__dirname, "..", "inventory.json");

function read() {
    const fileContent = fs.readFileSync(inventory, "utf-8");
    if (fileContent.trim() === "") return [];
    return JSON.parse(fileContent);
}

function write(data) {
    fs.writeFileSync(inventory, JSON.stringify(data, null, 2));
}

module.exports = {
    read,
    write,
};

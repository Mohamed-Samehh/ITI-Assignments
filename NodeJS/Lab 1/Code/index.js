const fs = require("fs");

const FILE = "inventory.json";

// Load
function loadInventoryItems() {
  if (!fs.existsSync(FILE)) return [];
  const content = fs.readFileSync(FILE, "utf8");
  if (!content.trim()) return [];
  return JSON.parse(content);
}

// Save
function save(items) {
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), "utf8");
}

// Get status
function getStatus(quantity) {
  if (quantity > 2) return "available";
  if (quantity > 0) return "low stock";
  return "out of stock";
}

// 1)
function add(name) {
  const items = loadInventoryItems();
  const id = items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;

  const newItem = {
    id: id,
    name: name,
    quantity: 1,
    category: "General",
    status: getStatus(1),
  };

  items.push(newItem);
  save(items);
  console.log("Done");
}

// 2)
function destock(id, amount) {
  const items = loadInventoryItems();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item || item.quantity < amount) {
    console.log("Error");
    return;
  }

  item.quantity -= amount;
  item.status = getStatus(item.quantity);
  save(items);
  console.log("Done");
}

// 3)
function restock(id, amount) {
  const items = loadInventoryItems();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) {
    console.log("Error");
    return;
  }

  item.quantity += amount;
  item.status = getStatus(item.quantity);
  save(items);
  console.log("Done");
}

// 4)
function edit(id, newName) {
  const items = loadInventoryItems();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) {
    console.log("Error");
    return;
  }

  item.name = newName;
  save(items);
  console.log("Done");
}

// 5)
function deleteItem(id) {
  const items = loadInventoryItems();
  const index = items.findIndex((i) => i.id === parseInt(id));

  if (index === -1) {
    console.log("Error");
    return;
  }

  items.splice(index, 1);
  save(items);
  console.log("Done");
}

// 6)
function list() {
  const items = loadInventoryItems();

  if (items.length === 0) {
    console.log("No items in inventory");
    return;
  }

  console.log("Inventory:");
  items.forEach((item) => {
    console.log(
      `- ${item.name} (ID: ${item.id}, Qty: ${item.quantity}, Status: ${item.status})`,
    );
  });
  console.log(`Total: ${items.length} items`);
}

// 7)
function summary() {
  const items = loadInventoryItems();

  if (items.length === 0) {
    console.log("No items in inventory");
    return;
  }

  const total = items.length;
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const available = items.filter((i) => i.status === "available").length;
  const lowStock = items.filter((i) => i.status === "low stock").length;
  const outOfStock = items.filter((i) => i.status === "out of stock").length;

  console.log("Summary:");
  console.log(`Total items: ${total}`);
  console.log(`Total quantity: ${totalQty}`);
  console.log(`Available: ${available}`);
  console.log(`Low stock: ${lowStock}`);
  console.log(`Out of stock: ${outOfStock}`);
}

// Main
const [, , command, arg1, arg2] = process.argv;

if (command === "add") add(arg1);
else if (command === "destock") destock(arg1, parseInt(arg2));
else if (command === "restock") restock(arg1, parseInt(arg2));
else if (command === "edit") edit(arg1, arg2);
else if (command === "delete") deleteItem(arg1);
else if (command === "list") list();
else if (command === "summary") summary();

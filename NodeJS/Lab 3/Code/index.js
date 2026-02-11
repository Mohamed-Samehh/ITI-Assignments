const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const inventory = path.join(__dirname, "inventory.json");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const products = read();
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Inventory</title>
</head>
<body>
  <h2>Inventory List</h2>
  <table border="1" cellpadding="5">
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    ${products.map((p) => `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.quantity}</td><td>${p.price}</td></tr>`).join("")}
  </table>
</body>
</html>`;
  res.send(html);
});

function postValidator() {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
    body("price").notEmpty().withMessage("Price is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ];
}

function patchValidator() {
  return [
    body("name").optional().notEmpty().withMessage("Name is required"),
    body("quantity").optional().notEmpty().withMessage("Quantity is required"),
    body("quantity")
      .optional()
      .isNumeric()
      .withMessage("Quantity must be a number"),
    body("price").optional().notEmpty().withMessage("Price is required"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
  ];
}

function stockValidator() {
  return [
    body("quantity").notEmpty().withMessage("Quantity is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
  ];
}

function read() {
  const fileContent = fs.readFileSync(inventory, "utf-8");
  if (fileContent.trim() === "") return [];
  return JSON.parse(fileContent);
}

function write(data) {
  fs.writeFileSync(inventory, JSON.stringify(data, null, 2));
}

app.get("/inventory", (req, res) => {
  const inventory = read();
  res.status(200).json(inventory);
});

app.get("/inventory/:id", (req, res) => {
  const inventory = read();
  const id = req.params.id;
  const item = inventory.find((item) => item.id === Number(id));
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.status(200).json(item);
});

app.post("/inventory", postValidator(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const inventory = read();
  const newId =
    inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1;
  const { id, ...bodyWithoutId } = req.body;
  const newItem = { id: newId, ...bodyWithoutId };
  inventory.push(newItem);
  write(inventory);
  res.status(201).json(newItem);
});

app.patch("/inventory/:id", patchValidator(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const inventory = read();
  const id = req.params.id;
  const item = inventory.find((item) => item.id === Number(id));
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const { id: bodyId, ...bodyWithoutId } = req.body;
  const result = inventory.map((item) =>
    item.id === Number(id) ? { ...item, ...bodyWithoutId } : item,
  );
  write(result);
  const updatedItem = result.find((item) => item.id === Number(id));
  res.status(200).json(updatedItem);
});

app.delete("/inventory/:id", (req, res) => {
  const inventory = read();
  const id = req.params.id;
  const item = inventory.find((item) => item.id === Number(id));
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const result = inventory.filter((item) => item.id !== Number(id));
  write(result);
  res.status(200).json(item);
});

app.patch("/inventory/:id/restock", stockValidator(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const inventory = read();
  const id = req.params.id;
  const item = inventory.find((item) => item.id === Number(id));
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const result = inventory.map((item) =>
    item.id === Number(id)
      ? { ...item, quantity: item.quantity + req.body.quantity }
      : item,
  );
  write(result);
  const updatedItem = result.find((item) => item.id === Number(id));
  res.status(200).json(updatedItem);
});

app.patch("/inventory/:id/destock", stockValidator(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const inventory = read();
  const id = req.params.id;
  const item = inventory.find((item) => item.id === Number(id));

  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  if (item.quantity < req.body.quantity) {
    return res.status(400).json({ error: "Insufficient quantity" });
  }

  const result = inventory.map((item) =>
    item.id === Number(id)
      ? { ...item, quantity: item.quantity - req.body.quantity }
      : item,
  );
  write(result);
  const updatedItem = result.find((item) => item.id === Number(id));
  res.status(200).json(updatedItem);
});

app.listen(3000, () => {
  console.log("http://127.0.0.1:3000");
});

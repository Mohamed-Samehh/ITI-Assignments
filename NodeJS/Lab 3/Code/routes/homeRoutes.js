const { read } = require("../data/inventoryStore");

module.exports = (app) => {
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
};

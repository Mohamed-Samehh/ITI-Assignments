const http = require("http");
const fs = require("fs");
const path = require("path");
const inventory = require("./inventory.json");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET") {
    if (url === "/") {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Inventory Management</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <h1>Our Inventory</h1>
    <ul class="inventory-list">
      ${inventory
        .map(
          (item) => `
        <li class="inventory-item">
          <span>${item.name} - ${item.quantity} units - ${item.category} - ${item.status}</span>
        </li>
      `,
        )
        .join("")}
    </ul>
  </div>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
      return;
    }

    if (url === "/styles.css") {
      const cssPath = path.join(__dirname, "styles.css");
      const cssStream = fs.createReadStream(cssPath);
      res.writeHead(200, { "Content-Type": "text/css" });
      cssStream.pipe(res);
      return;
    }

    if (url === "/astronomy") {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Astronomy</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <h1>Astronomy</h1>
    <div class="image-container">
      <img src="/astronomy.jpg" alt="Astronomy">
    </div>
    <div class="description">
      <p>Space is big and full of stars.</p>
      <p>We look at them with telescopes.</p>
    </div>
  </div>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
      return;
    }

    if (url === "/astronomy.jpg") {
      const imgPath = path.join(__dirname, "astronomy.jpg");
      const imgStream = fs.createReadStream(imgPath);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      imgStream.pipe(res);
      return;
    }

    if (url === "/serbal") {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Serbal</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <h1>Serbal</h1>
    <div class="image-container">
      <img src="/serbal.jpeg" alt="Serbal">
    </div>
    <div class="description">
      <p>Serbal is a nice place with rocks.</p>
      <p>People like to visit and relax.</p>
    </div>
  </div>
</body>
</html>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    if (url === "/serbal.jpeg") {
      const imgPath = path.join(__dirname, "serbal.jpeg");
      const imgStream = fs.createReadStream(imgPath);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      imgStream.pipe(res);
      return;
    }
  }

  if (method === "POST" && url === "/inventory") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newItem = JSON.parse(body);

      const newId =
        inventory.length > 0
          ? Math.max(...inventory.map((item) => item.id)) + 1
          : 1;
      newItem.id = newId;

      inventory.push(newItem);

      fs.writeFile(
        "./inventory.json",
        JSON.stringify(inventory, null, 2),
        () => {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Item added successfully",
              item: newItem,
            }),
          );
        },
      );
    });
    return;
  }

  const html404 = `
<!DOCTYPE html>
<html>
<head>
  <title>404 - Page Not Found</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>Page not found.</p>
  </div>
</body>
</html>`;
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end(html404);
});

server.listen(3000, () => {
  console.log("http://localhost:3000");
});

const express = require("express");
const path = require("path");

const homeRoutes = require("./routes/homeRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

homeRoutes(app);
inventoryRoutes(app);

app.listen(3000, () => {
  console.log("http://127.0.0.1:3000");
});

const { read } = require("../data/inventoryStore");

module.exports = (app) => {
  app.get("/", (req, res) => {
    const products = read();
    res.render("index", { products });
  });
};

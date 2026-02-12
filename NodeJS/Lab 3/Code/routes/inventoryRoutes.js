const { validationResult } = require("express-validator");

const { read, write } = require("../data/inventoryStore");
const {
    postValidator,
    patchValidator,
    stockValidator,
    filterValidator,
} = require("../validators/inventoryValidators");

module.exports = (app) => {
    app.get("/inventory", filterValidator(), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const inventory = read();

        const quantityQuery = req.query.quantity;
        const priceQuery = req.query.price;

        let result = inventory;

        if (quantityQuery !== undefined && quantityQuery !== "") {
            const quantity = Number(quantityQuery);
            result = result.filter((item) => Number(item.quantity) === quantity);
        }

        if (priceQuery !== undefined && priceQuery !== "") {
            const price = Number(priceQuery);
            result = result.filter((item) => Number(item.price) === price);
        }

        res.status(200).json(result);
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
};

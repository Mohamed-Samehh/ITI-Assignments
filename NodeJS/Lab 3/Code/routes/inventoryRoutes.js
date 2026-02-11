const express = require("express");
const { validationResult } = require("express-validator");

const { read, write } = require("../data/inventoryStore");
const {
    postValidator,
    patchValidator,
    stockValidator,
} = require("../validators/inventoryValidators");

const router = express.Router();

router.get("/inventory", (req, res) => {
    const inventory = read();
    res.status(200).json(inventory);
});

router.get("/inventory/:id", (req, res) => {
    const inventory = read();
    const id = req.params.id;
    const item = inventory.find((item) => item.id === Number(id));
    if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
    }
    res.status(200).json(item);
});

router.post("/inventory", postValidator(), (req, res) => {
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

router.patch("/inventory/:id", patchValidator(), (req, res) => {
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

router.delete("/inventory/:id", (req, res) => {
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

router.patch("/inventory/:id/restock", stockValidator(), (req, res) => {
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

router.patch("/inventory/:id/destock", stockValidator(), (req, res) => {
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

module.exports = router;

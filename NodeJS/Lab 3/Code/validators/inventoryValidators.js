const { body } = require("express-validator");

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

module.exports = {
    postValidator,
    patchValidator,
    stockValidator,
};

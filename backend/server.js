require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
res.json({
message: "CED TECH Product Showcase API is running!"
});
});

// 1. GET ALL PRODUCTS
app.get("/api/products", (req, res) => {
try {
const products = db.prepare(
"SELECT * FROM products ORDER BY id ASC"
).all();

    res.json(products);
} catch (error) {
    res.status(500).json({ error: "Failed to retrieve products." });
}

});

// 2. GET ONE PRODUCT
app.get("/api/products/:id", (req, res) => {
try {
const product = db.prepare(
"SELECT * FROM products WHERE id = ?"
).get(req.params.id);

    if (!product) {
        return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
} catch (error) {
    res.status(500).json({ error: "Failed to retrieve product." });
}

});

// 3. CREATE A PRODUCT
app.post("/api/products", (req, res) => {
try {
const {
product_name,
category,
brand,
price,
stock_quantity,
description
} = req.body;

    if (
        typeof product_name !== "string" || !product_name.trim() ||
        typeof category !== "string" || !category.trim() ||
        typeof brand !== "string" || !brand.trim() ||
        price === undefined || price === null || price === "" ||
        !Number.isFinite(Number(price)) || Number(price) < 0 ||
        stock_quantity === undefined || stock_quantity === null ||
        stock_quantity === "" ||
        !Number.isInteger(Number(stock_quantity)) ||
        Number(stock_quantity) < 0
    ) {
        return res.status(400).json({
            error: "Provide a product name, category, brand, valid price, and non-negative whole-number stock quantity."
        });
    }

    const result = db.prepare(`
        INSERT INTO products (
            product_name,
            category,
            brand,
            price,
            stock_quantity,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        product_name.trim(),
        category.trim(),
        brand.trim(),
        Number(price),
        Number(stock_quantity),
        description || ""
    );

    const newProduct = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(newProduct);
} catch (error) {
    res.status(500).json({ error: "Failed to create product." });
}

});

// 4. UPDATE A PRODUCT
app.put("/api/products/:id", (req, res) => {
try {
const existingProduct = db.prepare(
"SELECT * FROM products WHERE id = ?"
).get(req.params.id);

    if (!existingProduct) {
        return res.status(404).json({ error: "Product not found." });
    }

    const {
        product_name,
        category,
        brand,
        price,
        stock_quantity,
        description
    } = req.body;

    if (
        typeof product_name !== "string" || !product_name.trim() ||
        typeof category !== "string" || !category.trim() ||
        typeof brand !== "string" || !brand.trim() ||
        price === undefined || price === null || price === "" ||
        !Number.isFinite(Number(price)) || Number(price) < 0 ||
        stock_quantity === undefined || stock_quantity === null ||
        stock_quantity === "" ||
        !Number.isInteger(Number(stock_quantity)) ||
        Number(stock_quantity) < 0
    ) {
        return res.status(400).json({
            error: "Provide a product name, category, brand, valid price, and non-negative whole-number stock quantity."
        });
    }

    db.prepare(`
        UPDATE products
        SET product_name = ?,
            category = ?,
            brand = ?,
            price = ?,
            stock_quantity = ?,
            description = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        product_name.trim(),
        category.trim(),
        brand.trim(),
        Number(price),
        Number(stock_quantity),
        description || "",
        req.params.id
    );

    const updatedProduct = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(req.params.id);

    res.json(updatedProduct);
} catch (error) {
    res.status(500).json({ error: "Failed to update product." });
}

});

// 5. DELETE A PRODUCT
app.delete("/api/products/:id", (req, res) => {
try {
const result = db.prepare(
"DELETE FROM products WHERE id = ?"
).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: "Product not found." });
    }

    res.json({
        message: "Product deleted successfully.",
        id: Number(req.params.id)
    });
} catch (error) {
    res.status(500).json({ error: "Failed to delete product." });
}


});

// Start server
app.listen(PORT, () => {
console.log(`CED TECH API running at http://localhost:${PORT}`);
});

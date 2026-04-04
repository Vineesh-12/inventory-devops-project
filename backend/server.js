const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (ROBUST)
mongoose.connect("mongodb+srv://vineesh:vineesh123@cluster0.nfgcyan.mongodb.net/inventoryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    qty: Number,
    supplier: String,
    category: String
});

const Product = mongoose.model("Product", productSchema);

// History (temporary)
let history = [];

// ================== APIs ==================

// SELL API
app.post('/sell', async (req, res) => {
    try {
        const { id, qty } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.qty -= qty;
        await product.save();

        history.push(`Sold ${qty} of ${product.name}`);

        res.json({ message: "Sold successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Sell failed" });
    }
});

// Get products
app.get('/products', async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Add product
app.post("/products", async (req, res) => {
    try {
        const { name, price, qty, supplier, category } = req.body;

        const product = new Product({
            name,
            price,
            qty,
            supplier,
            category
        });

        await product.save();

        res.json({ message: "Product Added" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});

// History API
app.get('/history', (req, res) => {
    res.json(history);
});

// ================== FRONTEND ==================

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ================== SERVER ==================

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
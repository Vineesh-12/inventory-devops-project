const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://vineesh:vineesh123@cluster0.nfgcyan.mongodb.net/inventoryDB", {
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

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

// SELL API
app.post('/sell', async (req, res) => {
    const { id, qty } = req.body;

    const product = await Product.findById(id);

    if (product) {
        product.qty -= qty;
        await product.save();

        history.push(`Sold ${qty} of ${product.name}`);
    }

    res.send("Sold");
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Get products
app.get('/products', async (req, res) => {
    const data = await Product.find();
    res.json(data);
});

// Add product
app.post("/products", async (req, res) => {

    console.log(req.body);

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        supplier: req.body.supplier,
        category: req.body.category
    });

    await product.save();
    res.send("Product Added");
});

// Delete product
app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

// History API
app.get('/history', (req, res) => {
    res.json(history);
});

// Start server
app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});
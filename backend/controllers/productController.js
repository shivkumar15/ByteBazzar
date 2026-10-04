import Product from "../models/Product.js";
import { importSampleProducts } from "../utils/sampleProducts.js";

// Create a new product
export const createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body);
        res.json({
            message: 'Product created successfully',
            product,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const {search, category} = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

//Update a product
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            message: 'Product updated successfully',
            updated,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// Add sample products (laptops, mobiles, tablets, accessories) from a free public API
export const seedProducts = async (req, res) => {
    try {
        const { added, skipped } = await importSampleProducts();
        res.json({ message: `Added ${added} sample products`, added, skipped });
    } catch (error) {
        res.status(502).json({
            message: "Couldn't download sample products. Check your internet connection and try again.",
        });
    }
};

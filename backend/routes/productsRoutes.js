import express from 'express';
import {
 createProduct,
 getProducts,
 updateProduct,
 deleteProduct,
 seedProducts
} from "../controllers/productController.js";

const router = express.Router();

// Route to create a new product
router.post('/add', createProduct);

// Route to get all products
router.get('/', getProducts);

// Route to update a product by ID
router.put('/update/:id', updateProduct);

// Route to delete a product by ID
router.delete('/delete/:id', deleteProduct);

// Route to load sample products
router.post('/seed', seedProducts);

export default router;
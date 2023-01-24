import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/ProductController.js';

const ProductRoute = express.Router();

ProductRoute.get('/products', getProducts);
ProductRoute.get('/products/:id', getProductById);
ProductRoute.post('/products', createProduct);
ProductRoute.patch('/products/:id', updateProduct);
ProductRoute.delete('/products/:id', deleteProduct);

export default ProductRoute;

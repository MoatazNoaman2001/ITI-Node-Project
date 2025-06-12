import express from 'express';
const productRouter = express.Router();
import Product from "../models/product.js";
import { GetAllProducts, GetProductById, StoreProduct, 
    UpdateProduct, SearchProduct,
    DeleteProduct
 } from "../controllers/productController.js";
import { auth, restrectTo } from "../middelwares/auth.js";

productRouter.get("/", GetAllProducts);
productRouter.get("/:id",auth, restrectTo("seller", "user"), GetProductById);
productRouter.post("/",auth, restrectTo("seller"), StoreProduct);
productRouter.put("/:id",auth, restrectTo("seller"), UpdateProduct);
productRouter.delete("/:id",auth, restrectTo("seller"), DeleteProduct);
productRouter.get("/search",auth, restrectTo("seller", "user"), SearchProduct);

export default  productRouter;
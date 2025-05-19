const router  = require("express").Router();
const Product = require("../models/product");
import { GetAllProducts, GetProductById, StoreProduct, 
    UpdateProduct, DeleteProduct, SearchProduct
 } from "../controllers/productController";
import { auth, restrectTo } from "../middelwares/auth";

router.get("/", GetAllProducts);
router.get("/:id",auth, restrectTo("seller", "user"), GetProductById);
router.post("/",auth, restrectTo("seller"), StoreProduct);
router.put("/:id",auth, restrectTo("seller"), UpdateProduct);
router.delete("/:id",auth, restrectTo("seller"), DeleteProduct);
router.get("/search",auth, restrectTo("seller", "user"), SearchProduct);

module.exports = router;
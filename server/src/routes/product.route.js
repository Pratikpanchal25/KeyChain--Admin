import { Router } from "express"
import { tokenVarify } from "../middleware/tokenVarify.js"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controller/product.controller.js"
import { upload } from "../middleware/multer.middleware.js"
const productRouter = Router()

productRouter.post("/create-product", tokenVarify, upload.single("product_image"), createProduct);
productRouter.put("/update-product/:productId", tokenVarify, upload.single("product_image"), updateProduct);
productRouter.get("/list-products", getAllProducts);
productRouter.delete("/delte-product/:productId", tokenVarify, deleteProduct);

export default productRouter
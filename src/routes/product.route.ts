import { Router } from "express";
import {
  getProduct,
  searchProduct,
  getAllProducts,
} from "../controllers/product.controller";

export const ProductRouter: Router = Router();

ProductRouter.post("/getProduct", getProduct);
ProductRouter.post("/searchProduct", searchProduct);
ProductRouter.get("/getAllProducts", getAllProducts);

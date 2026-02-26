import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadImage, createProductWithImage } from "../controllers/uploadController";

const router = Router();

router.post("/image", upload.single("image"), uploadImage);
router.post("/product", upload.single("image"), createProductWithImage);

export default router;

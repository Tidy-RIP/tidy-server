import { Router } from "express";
import { uploadFile } from "../controller/uploadController.js";
import { uploadPdf } from "../../../middlewares/uploadMiddleware.js";

const uploadRoute = Router();

uploadRoute.post("/upload", uploadPdf("uploadPdf"), uploadFile);

export default uploadRoute;

import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";

import createError from "../helpers/createError.js";

// Almacenamiento
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "src/uploads"); // Guarda los PDF's
  },
  filename: (req, file, cb) => {
    const fileName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// Limite
const maxMb = 20;
const limits = { fileSize: 1024 * 1024 * maxMb };

// Filtro
const fileFilter = (req, file, cb) => {
  const fileType = /pdf/;
  const allowExtName = fileType.test(path.extname(file.originalname));

  if (!allowExtName) {
    return cb(createError("Solo se permiten archivos PDFs", 400));
  }

  return cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

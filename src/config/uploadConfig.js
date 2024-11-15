import { readFileSync } from "fs";
import multer from "multer";
import pdf from "pdf-parse";
import crypto from "node:crypto";
import path from "node:path";

import createError from "../helpers/createError";
import { logger } from "sequelize/lib/utils/logger";

// Almacenamiento
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./src/uploads"); // Guarada los PDF's
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

// Función para procesar el PDF
export const processPdf = async (filePath) => {
  try {
    logger.info(`Iniciando el procesamiento del PDF: ${filePath}`);
    const dataBuffer = readFileSync(filePath);
    const data = await pdf(dataBuffer);

    if (!data) {
      throw createError("Error al obtener la informacion del PDF", 400);
    }

    logger.info(`PDF procesado correctamente: ${filePath}`);
    return data.text;
  } catch (error) {
    logger.error(`Ocurrio un error al procesar el PDF: ${error.message}`);

    throw createError(
      "Ocurrio un error al procesar el PDF",
      error.statusCode || 500
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

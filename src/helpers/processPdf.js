import pdf from "pdf-parse/lib/pdf-parse.js";
import createError from "../helpers/createError.js";
import fs from "fs";
import logger from "../modules/logger/config.js";

// Función para procesar el PDF
export const processPdf = async (filePath) => {
  try {
    logger.info(`Iniciando el procesamiento del PDF: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);

    if (!data) {
      throw createError("Error al obtener la información del PDF", 400);
    }

    // Corrige los caracteres extraños usando la función fixTextEncoding
    const text = data.text;

    logger.info(`PDF procesado correctamente: ${filePath}`);
    return text;
  } catch (error) {
    logger.error(
      `Ocurrió un error al procesar el PDF: ${error.message}`,
      filePath
    );

    throw createError(
      "Ocurrió un error al procesar el PDF",
      error.statusCode || 500
    );
  }
};

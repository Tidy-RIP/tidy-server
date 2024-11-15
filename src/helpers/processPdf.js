import { PDFDocument } from "pdf-lib";
import pdf from "pdf-parse/lib/pdf-parse.js";
import createError from "../helpers/createError.js";
import fs from "fs";
import logger from "../modules/logger/config.js";

// Función para corregir caracteres extraños usando regex
const fixTextEncoding = (text) => {
  // Definimos un objeto de mapeo para los caracteres problemáticos
  const replacements = {
    "├í": "í",
    "├▒": "ñ",
    "├│": "ó",
    "├¡": "¡",
    "├¢": "¢",
    "├£": "£",
    // Agrega más reemplazos según sea necesario
  };

  // Crear un patrón regex a partir de las claves del objeto de reemplazo
  const pattern = new RegExp(
    Object.keys(replacements)
      .map((key) => key.replace(/[-\/\\^$.*+?()[\]{}|]/g, "\\$&"))
      .join("|"),
    "g"
  );

  // Usar el patrón para reemplazar los caracteres
  return text.replace(pattern, (match) => replacements[match]);
};

// Función para procesar el PDF
export const processPdf = async (filePath) => {
  try {
    logger.info(`Iniciando el procesamiento del PDF: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);

    // Usa pdf-lib para manipular el PDF si es necesario
    const pdfDoc = await PDFDocument.load(dataBuffer);
    // Aquí puedes manipular el PDF con pdf-lib si es necesario

    // Usa pdf-parse para extraer el texto
    const data = await pdf(dataBuffer);

    if (!data) {
      throw createError("Error al obtener la información del PDF", 400);
    }

    // Corrige los caracteres extraños usando la función fixTextEncoding
    const text = fixTextEncoding(data.text);

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

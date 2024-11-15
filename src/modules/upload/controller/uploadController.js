import logger from "../../logger/config.js";
import { processPdf } from "../../../helpers/processPdf.js";
import { extractItemsFromPdf } from "../../../helpers/pdfHelper.js";

export const uploadFile = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfText = await processPdf(pdfPath);

    logger.info(`Contenido del PDF:\n${pdfText}`);

    const { itemCount, filteredTitles } = extractItemsFromPdf(pdfText);

    console.log(`Número de ítems encontrados: ${itemCount}`);

    res.status(200).json({
      message: "Archivo subido con éxito",
      itemCount,
      items: filteredTitles,
    });
  } catch (error) {
    logger.error(`Error al procesar el archivo: ${error.message}`);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

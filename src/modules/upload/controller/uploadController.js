import createError from "../../../helpers/createError.js";
import logger from "../../logger/config.js";

import { processPdf } from "../../../helpers/processPdf.js";

export const uploadFile = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfText = await processPdf(pdfPath);

    logger.info(`Contenido del PDF:\n${pdfText}`);
    console.log(`asdf: ${pdfText}`);

    pdfText.split(/\d+\.\s/).map((e) => console.log(e + "\n\n"));

    res.status(200).json({ message: "Archivo subido con éxito" });
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
};

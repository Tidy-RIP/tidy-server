import logger from "../modules/logger/config.js";
import { upload } from "../config/uploadConfig.js";

export const uploadPdf = (fieldName) => (req, res, next) => {
  const uploadSingle = upload.single(fieldName);

  uploadSingle(req, res, (error) => {
    if (error || !req.file) {
      logger.error(`Error al subir el archivo: ${error}`);

      return res.status(400).json({ message: "Error al subir el archivo" });
    }

    req.body[fieldName] = req.file.filename;

    next();
  });
};

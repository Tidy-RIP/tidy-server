import { Notes } from "../models/notesModel.js";

import createError from "../../../helpers/createError.js";
import logger from "../../logger/config.js";

export const findNotesById = async (noteId) => {
  try {
    logger.info(`Buscando la nota con id: ${noteId}`);
    const notes = await Notes.findOne({ where: { id: noteId } });

    if (!notes) {
      logger.error(`Error al obtener la nota con id: ${noteId}`);
      throw createError("No se encontro la nota", 404);
    }

    return notes;
  } catch (error) {
    logger.error(`Error en el servidor al obtener la nota con id: ${noteId}`);

    throw createError(
      "Error en el servidor al obtener la nota",
      error.statusCode || 500
    );
  }
};

export const findNotesBySubjectId = async (subjectId) => {
  try {
    logger.info(`Buscando las nota de la materia con id: ${subjectId}`);
    const notes = await Notes.findAll({ where: { subject_id: subjectId } });

    if (!notes || notes.length === 0) {
      logger.error(
        `No se encontraron notas en la materia con id: ${subjectId}`
      );
      throw createError("No se encontraron notas en la materia", 404);
    }
    logger.info(`Ola soy la nota: ${JSON.stringify(notes)}`);

    return notes;
  } catch (error) {
    logger.error(
      `Error en el servidor al buscar las notas de la materia con id: ${subjectId}. Su error es: ${error.stack}`
    );

    throw createError(
      "Error en el servidor al buscar las notas de la materia",
      error.statusCode || 500
    );
  }
};

export const createNote = async (noteData) => {
  if (!noteData) {
    throw createError("Los datos de la nota son invalidos", 400);
  }

  try {
    const newNote = await Notes.create({ ...noteData });

    if (!newNote) {
      logger.error(`Error al crear una nueva nota`);
      throw createError("Error al crear una nueva nota", 400);
    }

    return newNote;
  } catch (error) {
    logger.error(
      `Ocurrio un error en el servidor al crear la nota. Su error es: ${error.stack}`
    );

    throw createError(
      "Ocurrio un error al crear una nueva nota",
      error.statusCode || 500
    );
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const note = await findNotesById(noteId);

    Object.assign(note, noteData);
    const newNote = await note.save();

    return newNote;
  } catch (error) {
    logger.error(
      `Ocurrio un error en el servidor al actualizar la nota con id: ${noteId}`
    );

    throw createError(
      "Ocurrio un error al actualizar la nota",
      error.statusCode || 500
    );
  }
};

export const deleteNote = async (noteId) => {
  try {
    logger.info(`Eliminando nota con id: ${noteId}`);
    const note = await findNotesById(noteId);

    if (!note) {
      throw createError("Error al eliminar la nota", 400);
    }

    await note.destroy();

    return note;
  } catch (error) {
    logger.error(
      `Ocurrio un error en el servidor al eliminar la nota con id: ${noteId}`
    );

    throw createError(
      "Ocurrio un error al eliminar la nota",
      error.statusCode || 500
    );
  }
};

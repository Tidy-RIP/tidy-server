import { findSubjectByIdAndUserId } from '../../subjects/services/subjectsService.js';
import { createNote, deleteNote, findNotesById, findNotesBySubjectId, updateNote } from '../services/noteService.js';
logger;

import logger from '../../logger/config.js';

export const getNoteByIdCtrl = async (req, res) => {
  const { idNote, idSubject } = req.params;
  const userId = req.user.id;

  try {
    const isSubject = await findSubjectByIdAndUserId(idSubject, userId);

    if (!isSubject) {
      return res.status(404).json({ message: 'La materia no se encontro' });
    }

    const isNote = await findNotesById(idNote);

    if (!isNote || isNote.subject_id !== isSubject.id) {
      logger.error(`No se encontro la nota con id: ${idNote} para la materia con id: ${idSubject}`);
      return res.status(404).json({ message: 'No se encontro la nota para la materia' });
    }

    res.status(200).json(isNote);
  } catch (error) {
    logger.error(`Error al obtener la nota con id: ${idNote} para la materia con id: ${idSubject}. Su error es: ${error.stack}`);

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? 'No se encontro la nota o la materia no tiene notas'
          : 'Error en el servidor al obtener la nota. Por favor, intentalo de nuevo.',
    });
  }
};

export const getNotesCtrl = async (req, res) => {
  const { idSubject } = req.params;
  const userId = req.user.id;

  try {
    const isSubject = await findSubjectByIdAndUserId(idSubject, userId);

    if (!isSubject) {
      return res.status(404).json({ message: 'La materia no se encontro' });
    }

    const isNote = await findNotesBySubjectId(idSubject);
    if (!isNote || isNote.subject_id !== isSubject.id) {
      logger.error(`No se encontraron notas en la materia con id: ${idSubject}`);
      return res.status(404).json({ message: 'No se encontraron las notas en la materia' });
    }

    return res.status(200).json({ Materia: isSubject.id, Notes: isNote });
  } catch (error) {
    logger.error(`Error al buscar las notas de la materia con id: ${idSubject}. Su error es: ${error.stack}`);

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? 'No se encontraron las notas o la materia no tiene notas'
          : 'Error en el servidor al obtener la nota. Por favor, intentalo de nuevo.',
    });
  }
};

export const createNoteCtrl = async (req, res) => {
  const { idSubject } = req.params;
  const { description } = req.body;
  const userId = req.user.id;

  try {
    const isSubject = await findSubjectByIdAndUserId(idSubject, userId);

    if (!isSubject) {
      return res.status(404).json({ message: 'No se encontro la materia para crear una nota' });
    }

    const newNote = await createNote({
      description,
      subject_id: isSubject.id,
    });

    res.status(201).json({
      message: 'Nota creada exitosamente',
      Nota: newNote,
    });
  } catch (error) {
    logger.error(`Ocurrio un error en el servidor al crear la nota. Su error es: ${error.stack}`);

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? 'Error al crear la nota.'
          : 'Error en el servidor al crear la nota. Por favor, intentalo de nuevo.',
    });
  }
};

export const updateNoteCtrl = async (req, res) => {
  const { idNote } = req.params;
  const { description } = req.body;
  const userId = req.user.id;

  try {
    logger.info(`Solicitud para actualizar la nota con id: ${idNote}`);
    const isNote = await findNotesById(idNote);

    if (!isNote) {
      return res.status(404).json({ message: 'No se encontro la nota para actualizar' });
    }

    const isSubject = await findSubjectByIdAndUserId(isNote.subject_id, userId);

    if (!isSubject) {
      return res.status(404).json({ message: 'No se encontro la materia' });
    }

    const updateByNote = await updateNote(idNote, {
      description,
    });

    res.status(200).json({ message: 'Nota actualizada correctamente', Materia: isSubject.subjectName, Nota: updateByNote });
  } catch (error) {
    logger.error(`Ocurrio un error al actualizar la nota. Su error es: ${error.stack}`);

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? 'Error al actualizar la nota.'
          : 'Error en el servidor al actualizar la nota. Por favor, intentalo de nuevo.',
    });
  }
};

export const deleteNoteCtrl = async (req, res) => {
  const { idNote, idSubject } = req.params;
  const userId = req.user.id;

  try {
    logger.info(`Solicitud para eliminar la nota con id: ${idNote}`);
    const isNote = await findNotesById(idNote);

    if (!isNote) {
      return res.status(404).json({ message: 'No se encontro la nota para eliminar' });
    }

    const isSubject = await findSubjectByIdAndUserId(idSubject, userId);

    if (!isSubject) {
      return res.status(404).json({ message: 'No se encontro la materia' });
    }

    if (!isNote || isNote.subject_id !== isSubject.id) {
      logger.error(`No se encontró la nota con id: ${idNote} para la materia con id: ${idSubject}`);
      return res.status(404).json({ message: 'No se encontró la nota para la materia' });
    }

    await deleteNote(idNote);

    res.status(200).json({
      message: 'Nota eliminada exitosamente',
      Materia: isSubject.subjectName,
      Nota: isNote,
    });
  } catch (error) {
    logger.error(
      `Ocurrio un error en el servidor al eliminar la nota con id: ${idNote} para el usuario con id: ${userId}. Su error es: ${error.stack}`
    );
    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? 'No se encontró la nota'
          : 'Error en el servidor al eliminar la nota. Por favor, intentalo de nuevo.',
    });
  }
};

import {
  findActivityById,
  updateActivity,
  deleteActivity,
  findActivitiesBySubjectId,
  createActivityWithSubtasks,
  getAllActivities,
} from "../services/activitiesService.js";
import { findSubjectByIdAndUserId } from "../../subjects/services/subjectsService.js";
import logger from "../../logger/config.js";

export const getActivities = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    logger.info(
      `Buscando actividad de la materia con id: ${id} para el usuario con id: ${userId}`
    );
    const subject = await findSubjectByIdAndUserId(id, userId);

    logger.info(`Materia encontrada: ${JSON.stringify(subject)}`);

    const activities = await findActivitiesBySubjectId(subject.id);
    res.status(200).json(activities);
    logger.info(`Actividades encontradas para la materia con id: ${id}`);
  } catch (error) {
    logger.error(
      `Error al obtener las actividades para la materia con id: ${id}. Su error es: ${error.stack}`
    );

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontraron actividades"
          : "Error en el servidor al obtener las actividades. Por favor, intentalo de nuevo.",
    });
  }
};

export const getActivitiesById = async (req, res) => {
  const { id, idActivity } = req.params;
  const userId = req.user.id;

  logger.info(
    `El id de la actividad: ${idActivity} de la materia con id: ${id}`
  );

  try {
    logger.info(
      `Buscando actividad con id: ${idActivity} de la materia con id: ${id} para el usuario con id: ${userId}`
    );
    const subject = await findSubjectByIdAndUserId(id, userId);

    if (!subject) {
      return res
        .status(404)
        .json({ message: "No se encontro la materia para la actividad" });
    }

    const activity = await findActivityById(idActivity);

    if (!activity || activity.subject_id !== subject.id) {
      return res
        .status(404)
        .json({ message: "No se encontro la actividad para la materia" });
    }

    res.status(200).json({ Materia: subject.id, Actividad: activity });

    logger.info(
      `Actividad encontrada con id: ${idActivity} para la materia con id: ${id}`
    );
  } catch (error) {
    logger.error(
      `Error al obtener la actividad con id: ${idActivity} para la materia con id: ${id}. Su error es: ${error.stack}`
    );

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontró la actividad"
          : "Error en el servidor al obtener la actividad. Por favor, intentalo de nuevo.",
    });
  }
};

export const createActivityCtrl = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    description,
    fecha_inicio,
    fecha_fin,
    estado,
    num_preguntas,
    prioridad_id,
    option,
  } = req.body;
  const userId = req.user.id;

  logger.info(`Esta es la opcion: ${option}`);

  try {
    logger.info(
      `Solicitud para crear una nueva actividad para la materia con id: ${id} y el usuario con id: ${userId}`
    );
    const subject = await findSubjectByIdAndUserId(id, userId);

    const newActivity = await createActivityWithSubtasks(
      {
        titulo,
        description,
        fecha_inicio,
        fecha_fin,
        estado,
        num_preguntas,
        prioridad_id,
        option,
        user_id: userId,
        subject_id: subject.id,
      },
      option
    );

    res.status(201).json({
      message: "Actividad creada exitosamente",
      activity: newActivity,
    });

    logger.info(
      `Actividad creada para la materia con id: ${id} y el usuario con id: ${userId}`
    );
  } catch (error) {
    logger.error(
      `Error al crear la actividad para la materia con id: ${id} y el usuario con id: ${userId}. Su error es: ${error.stack}`
    );

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontró la materia para la actividad"
          : "Error en el servidor al actualizar la actividad. Por favor, intentalo de nuevo.",
    });
  }
};

export const updateActivityCtrl = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    description,
    fecha_inicio,
    fecha_fin,
    estado,
    num_preguntas,
    prioridad_id,
    option,
  } = req.body;
  const userId = req.user.id;

  try {
    logger.info(
      `Solicitud para actualizar la actividad con id: ${id} para el usuario con id: ${userId}`
    );
    const activity = await findActivityById(id);
    const subject = await findSubjectByIdAndUserId(activity.subject_id, userId);

    const updatedActivity = await updateActivity(
      id,
      {
        titulo,
        description,
        fecha_inicio,
        fecha_fin,
        estado,
        num_preguntas,
        prioridad_id,
        option,
        user_id: userId,
        subject_id: subject.id,
      },
      option
    );

    res.status(200).json({
      message: "Actividad actualizada exitosamente",
      activity: updatedActivity,
    });

    logger.info(
      `Actividad con id: ${id} actualizada para el usuario con id: ${userId}`
    );
  } catch (error) {
    logger.error(
      `Error al actualizar la actividad con id: ${id} para el usuario con id: ${userId}. Su error es: ${error.stack}`
    );
    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontró la actividad"
          : "Error en el servidor al actualizar la actividad. Por favor, intentalo de nuevo.",
    });
  }
};

export const deleteActivityCtrl = async (req, res) => {
  const { id, idActivity } = req.params;
  const userId = req.user.id;

  try {
    logger.info(
      `Solicitud para eliminar la actividad con id: ${idActivity} de la materia con id: ${id} para el usuario con id: ${userId}`
    );
    const activity = await findActivityById(idActivity);

    if (!activity) {
      return res.status(404).json({ message: "No se encontró la actividad" });
    }

    const subject = await findSubjectByIdAndUserId(id, userId);

    if (!subject) {
      return res
        .status(404)
        .json({ message: "No se encontró la materia para la actividad" });
    }

    if (activity.subject_id !== subject.id) {
      logger.error(
        `La actividad con id: ${idActivity} no pertenece a la materia con id: ${id}`
      );
      return res
        .status(404)
        .json({ message: "La actividad no pertenece a la materia" });
    }

    await deleteActivity(idActivity);

    res.status(200).json({
      message: "Actividad eliminada exitosamente",
      Materia: subject,
      Actividad: activity,
    });

    logger.info(
      `Actividad con id: ${idActivity} eliminada para el usuario con id: ${userId}`
    );
  } catch (error) {
    logger.error(
      `Ocurrio un error en el servidor al eliminar la actividad con id: ${idActivity} para el usuario con id: ${userId}. Su error es: ${error.stack}`
    );

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontró la actividad"
          : "Error en el servidor al eliminar la actividad. Por favor, intentalo de nuevo.",
    });
  }
};

export const getAllActivitiesCtrl = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  try {
    const activities = await getAllActivities(userId);

    res.status(200).json(activities);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 404
          ? "No se encontró la actividad"
          : "Error en el servidor al eliminar la actividad. Por favor, intentalo de nuevo.",
    });
  }
};

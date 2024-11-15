import { z } from "zod";
import moment from "moment-timezone";

const timeZone = "America/Argentina/Buenos_Aires";

const parseDate = (date) => {
  const parsedDate = moment(date);
  if (!parsedDate.isValid()) {
    throw new Error(`Fecha no válida: ${date}`);
  }
  return moment.tz(parsedDate, timeZone).toDate();
};

export const activitiesSchema = z.object({
  titulo: z
    .string()
    .min(1, "Debe tener título")
    .max(100, "El título debe tener menos de 100 caracteres"),
  description: z.string().optional(),
  fecha_inicio: z.preprocess(
    parseDate,
    z.date().refine((date) => date <= new Date(), {
      message: "La fecha de inicio no puede ser en el futuro",
    })
  ),
  fecha_fin: z.preprocess(
    parseDate,
    z.date().refine((date) => date >= moment().startOf("day").toDate(), {
      message: "La fecha de fin no puede ser en el pasado",
    })
  ),
  estado: z
    .enum(["pendiente", "en_progreso", "completada"])
    .default("pendiente"),
  prioridad_id: z.preprocess(
    (val) => (val === undefined ? 3 : parseInt(val, 10)),
    z
      .number()
      .int()
      .refine((val) => [1, 2, 3].includes(val), {
        message: "Prioridad no válida",
      })
  ),
  num_preguntas: z
    .number()
    .int()
    .positive()
    .min(1, "Debe haber al menos una pregunta")
    .optional(),
  option: z.enum(["Option-1", "Option-2"]).optional(),
});

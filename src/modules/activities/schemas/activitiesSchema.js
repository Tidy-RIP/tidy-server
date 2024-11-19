import { z } from "zod";
import { DateTime } from "luxon";

const timeZone = "America/Argentina/Buenos_Aires";

const parseDate = (date) => {
  if (!date) return new Date();
  const parsedDate = DateTime.fromISO(date, { zone: timeZone });
  if (!parsedDate.isValid) {
    throw new Error(`Fecha no válida: ${date}`);
  }
  return parsedDate.toJSDate();
};

export const activitiesSchema = z.object({
  titulo: z
    .string()
    .min(1, "Debe tener título")
    .max(100, "El título debe tener menos de 100 caracteres"),
  description: z.string().optional(),
  fecha_inicio: z
    .preprocess(
      parseDate,
      z
        .date()
        .default(() => new Date())
        .refine((date) => date <= new Date(), {
          message: "La fecha de inicio no puede ser en el futuro",
        })
    )
    .optional(),
  fecha_fin: z
    .preprocess(
      parseDate,
      z
        .date()
        .default(() => new Date())
        .refine((date) => date >= DateTime.now().startOf("day").toJSDate(), {
          message: "La fecha de fin no puede ser en el pasado",
        })
    )
    .optional(),
  estado: z
    .enum(["pendiente", "en_progreso", "completada"])
    .default("pendiente"),
  prioridad_id: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .default(3)
    .refine((val) => [1, 2, 3].includes(val), {
      message: "Prioridad no válida",
    }),
  num_preguntas: z
    .number()
    .int()
    .positive()
    .min(1, "Debe haber al menos una pregunta")
    .default(1),
  option: z.enum(["Option-1", "Option-2"]).default("Option-1"),
});

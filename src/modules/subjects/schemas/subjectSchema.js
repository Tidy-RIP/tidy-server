import { z } from 'zod';

const subjectSchema = z.object({
  subjectName: z
    .string()
    .min(1, { message: 'La materia debe tener un nombre' })
    .max(50, { message: 'El nombre de la materia no puede tener más de 50 caracteres' }),
  description: z
    .string()
    .max(100, { message: 'La descripción de la materia no puede tener más de 100 caracteres' })
    .optional()
    .refine(val => val === undefined || val.length > 0, { message: 'La descripción no puede estar vacía si se proporciona' }),
  name_teacher: z
    .string()
    .max(50, { message: 'El nombre del profesor no puede tener más de 50 caracteres' })
    .optional()
    .refine(val => val === undefined || val.length > 0, {
      message: 'El nombre del profesor no puede estar vacío si se proporciona',
    }),
});

export default subjectSchema;

import { ZodError } from 'zod';

export const validationsZod = schema => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        message: 'Error de validación',
        errors: validationErrors,
      });
    }

    next(error);
  }
};

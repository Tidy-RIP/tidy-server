export const validationsZod = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    req.body = result.data; // Reemplaza el cuerpo de la solicitud con los datos validados
    next();
  } else {
    const validationErrors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      message: "Error de validación",
      errors: validationErrors,
    });
  }
};

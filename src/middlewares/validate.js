const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  console.log("req.body:", req.body);
  console.log("validated:", value);

  if (error) return next(error);
  req.validated = value;
  next();
};

export default validate;

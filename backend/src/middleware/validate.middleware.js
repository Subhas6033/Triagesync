import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ApiError(400, "Request validation failed", "VALIDATION_ERROR"),
      );
    }

    req.body = result.data;

    next();
  };
};

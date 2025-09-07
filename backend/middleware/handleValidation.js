import { validationResult } from 'express-validator';

/**
 * Converts express-validator errors into { field, msg }.
 */
export default function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const first = result.array({ onlyFirstError: true })[0];
  return res.status(400).json({ field: first.path, msg: first.msg });
}

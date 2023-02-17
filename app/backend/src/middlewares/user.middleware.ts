import { NextFunction, Request, Response } from 'express';
import { errorBlankFields } from '../utils/errorsMessage';

export default async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: errorBlankFields });
  }

  next();
}

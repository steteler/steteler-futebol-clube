import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler';

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _Next: NextFunction,
) => {
  if (error instanceof ErrorHandler) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};

export default errorMiddleware;

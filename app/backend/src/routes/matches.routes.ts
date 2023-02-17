import * as express from 'express';
import authValidation from '../utils/authValidation';
import MatchesController from '../controllers/matches.controller';

const matchesRouter = express.Router();

const matchesController = new MatchesController();

matchesRouter.get('/', matchesController.getAll);
matchesRouter.post('/', authValidation, matchesController.insertMatch);
matchesRouter.patch('/:id/finish', matchesController.endsMatch);
matchesRouter.patch('/:id', matchesController.updateGoals);

export default matchesRouter;

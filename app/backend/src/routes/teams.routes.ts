import * as express from 'express';
import TeamsController from '../controllers/teams.controller';

const teamsRouter = express.Router();

const teamsController = new TeamsController();

teamsRouter.get('/', teamsController.getAll);
teamsRouter.get('/:id', teamsController.getByID);

export default teamsRouter;

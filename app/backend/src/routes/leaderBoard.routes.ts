import * as express from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const leaderBoardRouter = express.Router();

const leaderBoardController = new LeaderboardController();

leaderBoardRouter.get('/', leaderBoardController.getAll);
leaderBoardRouter.get('/home', leaderBoardController.getAll);
leaderBoardRouter.get('/away', leaderBoardController.getAll);

export default leaderBoardRouter;

import { Request, Response } from 'express';
import ILeaderboard from '../interfaces/ILeaderboard';
import leaderBoardService from '../services/leaderboard.service';

export default class LeaderboardController {
  private sortScore = (leaderboard: ILeaderboard[]): ILeaderboard[] =>
    leaderboard.sort(
      (a, b) => b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || b.goalsOwn - a.goalsOwn,
    );

  public getAll = async (req: Request, res: Response) => {
    const { path } = req.route;

    if (path === '/home') {
      const homeLeaderboard = await leaderBoardService.getAllHome();
      return res.status(200).json(this.sortScore(homeLeaderboard));
    }

    if (path === '/away') {
      const awayLeaderboard = await leaderBoardService.getAllAway();
      return res.status(200).json(this.sortScore(awayLeaderboard));
    }

    const allLeaderboard = await leaderBoardService.getAll();
    res.status(200).json(this.sortScore(allLeaderboard));
  };
}

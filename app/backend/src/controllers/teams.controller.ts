import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const allTeams = await TeamsService.getAll();
    res.status(200).json(allTeams);
  };

  public getByID = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const teamName = await TeamsService.getById(+id);
    res.status(200).json(teamName);
  };
}

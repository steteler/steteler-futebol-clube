import { Request, Response } from 'express';
import matchesService from '../services/matches.service';

export default class MatchesController {
  public getAll = async (req: Request, res: Response) => {
    if (req.query.inProgress) {
      const status = !!req.query.inProgress;

      const filteredMatches = await matchesService.matchesInProgress(status);

      return res.status(200).json(filteredMatches);
    }
    const allMatches = await matchesService.getAll();
    res.status(200).json(allMatches);
  };

  public insertMatch = async (req: Request, res: Response): Promise<void> => {
    const matchInserted = await matchesService.insertMatch(req.body);
    res.status(201).json(matchInserted);
  };

  public endsMatch = async (req: Request, res: Response): Promise<void> => {
    await matchesService.endsMatch(+req.params.id);
    res.status(200).json({ message: 'Finished' });
  };

  public updateGoals = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await matchesService.updateGoals(+id, req.body);
    res.status(200).json({ message: `Match ${id} was updated successfully!` });
  };
}

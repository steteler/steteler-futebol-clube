import ITeams from '../interfaces/ITeams';
import Teams from '../database/models/Teams.Model';
import ErrorHandler from '../utils/errorHandler';

export default class TeamsService {
  static async getAll(): Promise<ITeams[]> {
    const teams = await Teams.findAll();
    return teams;
  }

  static async getById(id: number): Promise<ITeams> {
    const team = await Teams.findByPk(id);

    if (team) {
      return team;
    }

    throw new ErrorHandler(401, 'Team not Found');
  }
}

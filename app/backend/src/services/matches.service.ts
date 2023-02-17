import IMatches from '../interfaces/IMatches';
import Matches from '../database/models/Matches.Model';
import Teams from '../database/models/Teams.Model';
import { errorSameTeam, errorTeamIdInvalid } from '../utils/errorsMessage';
import ErrorHandler from '../utils/errorHandler';
import IGoalsToUpdate from '../interfaces/IGoalsToUpdate';

export default class MatchesService {
  static async getAll(): Promise<Matches[]> {
    const matches = await Matches.findAll({
      include: [
        {
          model: Teams,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: Teams,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });

    return matches;
  }

  static async matchesInProgress(progress: boolean): Promise<Matches[]> {
    const filteredMatches = await Matches.findAll({
      where: { inProgress: progress },
      include: [
        {
          model: Teams,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: Teams,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });

    return filteredMatches;
  }

  static async insertMatch(match: IMatches): Promise<IMatches> {
    const { homeTeamId, awayTeamId } = match;

    if (homeTeamId === awayTeamId) {
      const { status, message } = errorSameTeam;
      throw new ErrorHandler(status, message);
    }

    await this.teamsIsValid(+match.homeTeamId, +match.awayTeamId);
    const matchInserted = await Matches.create({ ...match, inProgress: true });

    return matchInserted as unknown as IMatches;
  }

  static async teamsIsValid(homeTeam: number, awayTeam: number): Promise<boolean> {
    const homeTeamIsValid = await Teams.findByPk(homeTeam);
    const awayTeamIsValid = await Teams.findByPk(awayTeam);

    if (homeTeamIsValid && awayTeamIsValid) {
      return true;
    }

    const { status, message } = errorTeamIdInvalid;
    throw new ErrorHandler(status, message);
  }

  static async endsMatch(id: number): Promise<void> {
    await Matches.update({ inProgress: false }, { where: { id } });
  }

  static async updateGoals(id: number, goalsToUpdate: IGoalsToUpdate) {
    await Matches.update(
      {
        homeTeamGoals: goalsToUpdate.homeTeamGoals,
        awayTeamGoals: goalsToUpdate.awayTeamGoals,
      },
      { where: { id } },
    );
  }
}

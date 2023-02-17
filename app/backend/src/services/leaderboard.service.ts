import ILeaderboard from '../interfaces/ILeaderboard';
import IMatches from '../interfaces/IMatches';
import {
  getDrawsHome,
  getDrawsAway,
  getHomeGoalsFavor,
  getHomeGoalsOwn,
  getHomeLosses,
  getHomePoints,
  getHomeWins,
  getAwayPoints,
  getAwayWins,
  getAwayLosses,
  getAwayGoalsFavor,
  getAwayGoalsOwn,
  allLeaderboards,
} from '../utils/functionsUtils';
import MatchesService from './matches.service';
import TeamsService from './teams.service';

export default class LeaderboardService {
  static async matchesEnded(): Promise<IMatches[]> {
    const filteredMatches = await MatchesService.matchesInProgress(false);
    return filteredMatches as unknown as IMatches[];
  }

  static async findHomeTeamsMatches(id: number): Promise<IMatches[]> {
    const filteredMatches = await this.matchesEnded();
    return filteredMatches.filter(({ homeTeamId }) => homeTeamId === id);
  }

  static async findAwayTeamsMatches(id: number): Promise<IMatches[]> {
    const filteredMatches = await this.matchesEnded();
    return filteredMatches.filter(({ awayTeamId }) => awayTeamId === id);
  }

  static async getAllHome(): Promise<ILeaderboard[]> {
    const allTeams = await TeamsService.getAll();

    const teams = await Promise.all(
      allTeams.map(async ({ id }) => this.findHomeTeamsMatches(id)),
    );

    const infoTeams = teams.map((team, index) => ({
      name: allTeams[index].teamName,
      totalPoints: team.reduce(getHomePoints, 0),
      get totalGames(): number { return this.totalVictories + this.totalDraws + this.totalLosses; },
      totalVictories: team.reduce(getHomeWins, 0),
      totalDraws: team.reduce(getDrawsHome, 0),
      totalLosses: team.reduce(getHomeLosses, 0),
      goalsFavor: team.reduce(getHomeGoalsFavor, 0),
      goalsOwn: team.reduce(getHomeGoalsOwn, 0),
      get goalsBalance(): number { return this.goalsFavor - this.goalsOwn; },
      get efficiency() { return ((this.totalPoints / (this.totalGames * 3)) * 100).toFixed(2); },
    }));

    return infoTeams;
  }

  static async getAllAway(): Promise<ILeaderboard[]> {
    const allTeams = await TeamsService.getAll();

    const teams = await Promise.all(
      allTeams.map(async ({ id }) => this.findAwayTeamsMatches(id)),
    );

    const infoTeams = teams.map((team, index) => ({
      name: allTeams[index].teamName,
      totalPoints: team.reduce(getAwayPoints, 0),
      get totalGames(): number { return this.totalVictories + this.totalDraws + this.totalLosses; },
      totalVictories: team.reduce(getAwayWins, 0),
      totalDraws: team.reduce(getDrawsAway, 0),
      totalLosses: team.reduce(getAwayLosses, 0),
      goalsFavor: team.reduce(getAwayGoalsFavor, 0),
      goalsOwn: team.reduce(getAwayGoalsOwn, 0),
      get goalsBalance(): number { return this.goalsFavor - this.goalsOwn; },
      get efficiency() { return ((this.totalPoints / (this.totalGames * 3)) * 100).toFixed(2); },
    }));

    return infoTeams;
  }

  static async getAll(): Promise<ILeaderboard[]> {
    const home = await this.getAllHome();
    const away = await this.getAllAway();

    const allLeaderBoards = allLeaderboards(home, away);
    return allLeaderBoards;
  }
}

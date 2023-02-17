import ILeaderboard from '../interfaces/ILeaderboard';
import IMatches from '../interfaces/IMatches';

export const getHomePoints = (acc: number, curr: IMatches): number => {
  if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 3;
  if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
  return acc;
};

export const getHomeWins = (acc: number, curr: IMatches): number => {
  if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 1;
  return acc;
};

export const getDrawsHome = (acc: number, curr: IMatches): number => {
  if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
  return acc;
};

export const getHomeLosses = (acc: number, curr: IMatches): number => {
  if (curr.awayTeamGoals > curr.homeTeamGoals) return acc + 1;
  return acc;
};

export const getHomeGoalsFavor = (acc: number, curr: IMatches): number =>
  curr.homeTeamGoals + acc;

export const getHomeGoalsOwn = (acc: number, curr: IMatches): number =>
  curr.awayTeamGoals + acc;

export const getAwayPoints = (acc: number, curr: IMatches): number => {
  if (curr.awayTeamGoals > curr.homeTeamGoals) return acc + 3;
  if (curr.awayTeamGoals === curr.homeTeamGoals) return acc + 1;
  return acc;
};

export const getAwayWins = (acc: number, curr: IMatches): number => {
  if (curr.awayTeamGoals > curr.homeTeamGoals) return acc + 1;
  return acc;
};

export const getAwayLosses = (acc: number, curr: IMatches): number => {
  if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 1;
  return acc;
};

export const getAwayGoalsFavor = (acc: number, curr: IMatches): number =>
  curr.awayTeamGoals + acc;

export const getAwayGoalsOwn = (acc: number, curr: IMatches): number =>
  curr.homeTeamGoals + acc;

export const getDrawsAway = (acc: number, curr: IMatches): number => {
  if (curr.awayTeamGoals === curr.homeTeamGoals) return acc + 1;
  return acc;
};

export const allLeaderboards = (home: ILeaderboard[], away: ILeaderboard[]): ILeaderboard[] =>
  home.map((team, index) => {
    const mergedTeam = Object.entries(team).reduce(
      (acc, [key, value]: [string, string | number]) => ({
        ...acc,
        [key]:
          typeof value === 'number'
            ? value + Number(away[index][key as keyof ILeaderboard])
            : value,
      }),
      away[index],
    );
    return {
      ...mergedTeam,
      get goalsBalance(): number { return mergedTeam.goalsFavor - mergedTeam.goalsOwn; },
      get efficiency() {
        return ((mergedTeam.totalPoints / (mergedTeam.totalGames * 3)) * 100).toFixed(2);
      },
    } as ILeaderboard;
  });

import { MlbTeams as Teams } from "./mlb2023-teams.js";

class GameResult {
  constructor({ gamePk, date, home, road, score, status }) {
    this.gamePk = gamePk;
    this.date = date;
    const scores = score.replace(/\s+/g, "").split("-").map((s) => Number(s));
    this.sign = Math.sign(scores[0] - scores[1]);
    this.home = {
      team: home,
      score: scores[1]
    };
    this.road = {
      team: road,
      score: scores[0]
    };
    this.status = status;
  }

  get winner() {
    return [this.home.team, "Tied", this.road.team][this.sign + 1];
  }

  get loser() {
    return [this.road.team, "Tied", this.home.team][this.sign + 1];
  }

  get isTied() {
    return this.sign === 0;
  }

  get isOneRunGame() {
    return Math.abs(this.home.score - this.road.score) === 1;
  }

  get isShutOutGame() {
    return this.home.score === 0 || this.road.score === 0;
  }

  get isTenPlusRunsGame() {
    return this.home.score > 9 || this.road.score > 9;
  }

  get isInterLeagueGame() {
    return Teams.league(this.home.team) !== Teams.league(this.road.team);
  }

  isGameOf(team) {
    return [this.home, this.road].some(o => o.team === team);
  }

  opponentOf(team) {
    return [this.home, this.road].find(o => o.team !== team).team;
  }

  runsScored(team) {
    return [this.home, this.road].find(o => o.team === team).score;
  }

  runsAllowed(team) {
    return [this.home, this.road].find(o => o.team !== team).score;
  }
}

const toGameResult = (obj) => (new GameResult(obj));

export { GameResult, toGameResult };

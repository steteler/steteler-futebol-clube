import * as sinon from 'sinon';
import * as chai from 'chai';
import LeaderboardService from '../services/leaderboard.service';
import {
  homeLeaderBoardMock,
  awayLeaderBoardMock,
  getAllMock,
} from './mocks/leaderboards.mock';

// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import { Response } from 'superagent';
import { finishedMatches } from './mocks/matches.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Checking Route /leaderboard', () => {
  let chaiHttpResponse: Response;

  afterEach(function () {
    sinon.restore();
  });

  it('/leaderboard/home is working as intended', async () => {
    sinon
      .stub(LeaderboardService, 'getAllHome')
      .resolves(homeLeaderBoardMock as any);

    const chaiHttpResponse = await chai.request(app).get('/leaderboard/home');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderBoardMock);
  });

  it('/leaderboard/away is working as intended', async () => {
    sinon
      .stub(LeaderboardService, 'getAllAway')
      .resolves(awayLeaderBoardMock as any);

    const chaiHttpResponse = await chai.request(app).get('/leaderboard/away');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderBoardMock);
  });

  it('/leaderboard/away is working as intended', async () => {
    sinon
      .stub(LeaderboardService, 'getAll')
      .resolves(getAllMock as any);

    const chaiHttpResponse = await chai.request(app).get('/leaderboard');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(getAllMock);
  });
});
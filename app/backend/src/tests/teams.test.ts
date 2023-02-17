import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { App } from '../app';
import TeamsModel from '../database/models/Teams.Model';
import { Response } from 'superagent';
import { teamsMock, homeTeamMock } from './mocks/teams.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Valida a rota /teams', () => {
  let chaiHttpResponse: Response;

  afterEach(function () {
    sinon.restore();
  });

  it('Valida se retorna todos os times', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(teamsMock as TeamsModel[]);

    const chaiHttpResponse = await chai.request(app).get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(teamsMock);
  });

  it('Valida se retorna apenas um time', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(homeTeamMock as TeamsModel);

    const chaiHttpResponse = await chai.request(app).get('/teams/3');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(homeTeamMock);
  });

  it('Valida se o time existe', async () => {
    sinon.stub(TeamsModel, 'findByPk').resolves(null);

    const chaiHttpResponse = await chai.request(app).get('/teams/99');

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Team not Found',
    });
  });
});
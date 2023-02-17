import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import { Response } from 'superagent';
import MatchesModel from '../database/models/Matches.Model';
import TeamsModel from '../database/models/Teams.Model';
import {
  matchesInProgresMock,
  matchesMock,
  bodyToCreate,
  invalidTeamMock,
  matchCreated,
  sameTeamMock,
} from './mocks/matches.mock';
import * as jwt from 'jsonwebtoken';
import { homeTeamMock, awayTeamMock } from './mocks/teams.mock';
import { invalidToken } from './mocks/user.mock';
import { errorSameTeam, errorTeamIdInvalid } from '../utils/errorsMessage';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('Valida a rota /matches', () => {
  let chaiHttpResponse: Response;

  afterEach(function () {
    sinon.restore();
  });

  it('Valida o retorno de todas as matches', async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(matchesMock as unknown as MatchesModel[]);

    const chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesMock);
  });

  it('Valida todas matches in progress', async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(matchesInProgresMock as unknown as MatchesModel[]);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchesInProgresMock);
  });

  it('Valida se é possível inserir nova match', async () => {
    sinon
      .stub(jwt, 'verify')
      .resolves({ email: 'admin@admin.com', password: 'secret_admin' });
    sinon
      .stub(TeamsModel, 'findByPk')
      .onFirstCall()
      .resolves(homeTeamMock as TeamsModel)
      .onSecondCall()
      .resolves(awayTeamMock as TeamsModel);
    sinon.stub(MatchesModel, 'create').resolves(matchCreated as any);

    const chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send(bodyToCreate)
      .set('authorization', 'Token Authorized');

    expect(chaiHttpResponse.status).to.be.equal(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(matchCreated);
  });

  it("Valida se é possível inserir com um token inválido", async () => {
    sinon.stub(jwt, 'verify').throws(Error);
    const chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set({ authorization: invalidToken });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token must be a valid token',
    });
  });

  it("Valida se é possível inserir dois times iguais", async () => {
    sinon
      .stub(jwt, 'verify')
      .resolves({ email: 'admin@admin.com', password: 'secret_admin' });

    const chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send(sameTeamMock)
      .set('authorization', 'Token Authorized');

    expect(chaiHttpResponse.status).to.be.equal(errorSameTeam.status);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: errorSameTeam.message,
    });
  });

  it("Valida se é possível inserir um time com id inválido", async () => {
    sinon
      .stub(jwt, 'verify')
      .resolves({ email: 'admin@admin.com', password: 'secret_admin' });

    const chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send(invalidTeamMock)
      .set('authorization', 'Token Authorized');

    expect(chaiHttpResponse.status).to.be.equal(errorTeamIdInvalid.status);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: errorTeamIdInvalid.message,
    });
  });

  it('Valida se o match é finalizado', async () => {
    sinon.stub(MatchesModel, 'update').resolves();

    const chaiHttpResponse = await chai.request(app).patch('/matches/1/finish');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Finished' });
  });

  it('Valida se é possível atualizar os gols do match', async () => {
    sinon.stub(MatchesModel, 'update').resolves();

    const chaiHttpResponse = await chai.request(app).patch('/matches/1').send({
      homeTeamGoals: 5,
      awayTeamGoals: 3,
    });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Match 1 was updated successfully!',
    });
  });
});
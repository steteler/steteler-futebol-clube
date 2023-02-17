import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import {
  completeUser,
  failedAuthLogin,
  invalidToken,
  missingInfoLogin,
  successAuthLogin,
  validToken,
} from './mocks/user.mock';
import { App } from '../app';
import UserModel from '../database/models/User.Model';
import { Response } from 'superagent';
import * as jwt from 'jsonwebtoken';
import { errorBlankFields, errorEmailPasswordInvalid } from '../utils/errorsMessage';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Checking Route /login', () => {
  let chaiHttpResponse: Response;

  afterEach(function () {
    sinon.restore();
  });

  it('Valida se foi feito login com sucesso', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(completeUser as unknown as UserModel);

    sinon.stub(jwt, 'sign').resolves(validToken);

    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(successAuthLogin);

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({ token: validToken });
  });

  it('Valida se o campo senha foi preenchido', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(missingInfoLogin);

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: errorBlankFields });
  });

  it('Valida se a senha é válida', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(failedAuthLogin);

    expect(chaiHttpResponse.status).to.be.equal(
      errorEmailPasswordInvalid.status
    );
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: errorEmailPasswordInvalid.message,
    });
  });

  it('Valida o token do usuário', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(completeUser as unknown as UserModel);
    sinon.stub(jwt, 'verify').resolves(invalidToken);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .send();

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token not found',
    });
  });

  it('Valida se o token é inválido', async () => {
    sinon.stub(jwt, 'verify').throws(Error);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: invalidToken });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'Token must be a valid token',
    });
  });

  it('Valida se existe um token válido', async () => {
    sinon.stub(UserModel, 'findOne').resolves(null);
    sinon.stub(jwt, 'verify').resolves(validToken);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: validToken });

    expect(chaiHttpResponse.status).to.be.equal(401);
  });

  it('Valida se o usuario tem um token válido', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(completeUser as unknown as UserModel);
    sinon.stub(jwt, 'verify').resolves(validToken);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set({ authorization: validToken });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      role: 'user',
    });
  });
});
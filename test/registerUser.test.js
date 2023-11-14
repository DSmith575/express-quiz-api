import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import urlPath from '../utils/consonants/globalConsonants.js';

import app from '../index.js';

chai.use(chaiHttp);

const BASE_PATH = `/${urlPath.INDEX_PATHS.BASE_URL}/${urlPath.INDEX_PATHS.CURRENT_VERSION}`;

const REGISTER_PATH = `${BASE_PATH}/auth/register`;

const firstName = {
  firstName: 'testSuite',
};

const lastName = {
  firstName: 'testSuite',
  lastName: 'lastName',
};

const username = {
  firstName: 'testSuite',
  lastName: 'lastName',
  username: 'memer',
};

const email = {
  firstName: 'testSuite',
  lastName: 'lastName',
  username: 'memer',
  email: 'meme@test.com',
};

const registerSuite = {
  firstName: 'testSuite',
  lastName: 'testSuite',
  username: 'tester',
  emailFalse: 'test@test.com',
  emailCorrect: 'tester@test.com',
  passwordNoSpec: 'test1234',
  password: 'test123!',
  confirmPassword: 'test123!',
};

describe('register basic user', () => {
  it('should return message First name is required', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('First name is required');
        done();
      });
  });

  it('should return a message Last name is required', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send(firstName)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Last name is required');
        done();
      });
  });

  it('should return a message username is required', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send(lastName)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Username is required');
        done();
      });
  });

  it('should return a message email is required', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send(username)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email is required');
        done();
      });
  });

  it('should return message email must match username', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send(email)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email must match the username');
        done();
      });
  });
});

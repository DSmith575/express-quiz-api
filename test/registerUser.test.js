import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import urlPath from '../utils/consonants/globalConsonants.js';

import app from '../index.js';

// Destructuring the registerSuite object to get the data required, then passing that as an object in the chai.send method
// const { firstName } = registerSuite
// chai.send({ firstName })

chai.use(chaiHttp);

const BASE_PATH = `/${urlPath.INDEX_PATHS.BASE_URL}/${urlPath.INDEX_PATHS.CURRENT_VERSION}`;

const REGISTER_PATH = `${BASE_PATH}/auth/register`;

const registerSuite = {
  firstName: 'testSuite',
  lastName: 'testSuite',
  username: 'tester',
  email: 'tester@test.com',
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

  it('should return message First name has a min length of 2', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName: 'a' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('First name should have a minimum length of 2');
        done();
      });
  });

  it('should return message First name has a max length of 50', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName: 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('First name should have a maximum length of 50');
        done();
      });
  });

  it('should test if First name is a string', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName: 123 })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('First name should be a string');
        done();
      });
  });

  it('should return a message First name cannot be empty', (done) => {
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName: '' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('First name should not be empty');
        done();
      });
  });

  it('should return a message Last name is required', (done) => {
    const { firstName } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Last name is required');
        done();
      });
  });

  it('should return a message username is required', (done) => {
    const { firstName, lastName } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Username is required');
        done();
      });
  });

  it('should check that username does not contain special characters', (done) => {
    const { firstName, lastName } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username: 'testSuite!' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Username should only contain alphanumeric characters');
        done();
      });
  });

  it('should return a message email is required', (done) => {
    const { firstName, lastName, username } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email is required');
        done();
      });
  });

  it('should return a message email must match username', (done) => {
    const { firstName, lastName, username } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email: 'incorrect@test.com' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email must match the username');
        done();
      });
  });

  it('should return a message email invalid format', (done) => {
    const { firstName, lastName, username } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email: 'tester@test' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email format invalid');
        done();
      });
  });

  it('should return a message password must have min length of 8', (done) => {
    const { firstName, lastName, username, email } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email, password: 'a' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Password should have a minimum length of 8');
        done();
      });
  });

  it('should return a message password must have min length of 16', (done) => {
    const { firstName, lastName, username, email } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email, password: 'qwertyqwertyqwertyqwerty' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Password should have a maximum length of 16');
        done();
      });
  });

  it('should check if password contains a numeric or special character', (done) => {
    const { firstName, lastName, username, email } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email, password: 'password' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Password should contain at least one numeric and one special character');
        done();
      });
  });

  it('should check if confirm password matches password', (done) => {
    const { firstName, lastName, username, email, password } = registerSuite;
    chai
      .request(app)
      .post(`${REGISTER_PATH}`)
      .send({ firstName, lastName, username, email, password, confirmPassword: 'incorrectPassword' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Confirm Password does not match');
        done();
      });
  });
});

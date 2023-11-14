import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../index.js';

chai.use(chaiHttp);

const baseurl = 'api/v1';

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

describe('register basic user', () => {
  it('should return message First name is required', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
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
      .post('/api/v1/auth/register')
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
      .post('/api/v1/auth/register')
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
      .post('/api/v1/auth/register')
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
      .post('/api/v1/auth/register')
      .send(email)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Email must match the username');
        done();
      });
  });
});

// describe('quizzes', () => {
//     it('should find no quiz', (done) => {
//         chai
//         .request(app)
//         .get('/api/v1/auth/quizzes/500')
//         .end((req, res) => {
//             chai.expect(res.status).to.be.equal(403);
//             chai.expect(res.body).to.be.a('object');
//             chai.expect(res.body.msg)
//             .to.be.equal('No token provided');
//             done();
//         })
//     })
// })

import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import urlPath from '../utils/consonants/globalConsonants.js';
import getCurrentDate from '../utils/dateTime/currentDate.js';
import quizValues from '../utils/consonants/quizConsonants.js';

import app from '../index.js';

// Destructuring the registerSuite object to get the data required, then passing that as an object in the chai.send method
// const { name } = quizSuite
// chai.send({ name })

chai.use(chaiHttp);

const BASE_PATH = `/${urlPath.INDEX_PATHS.BASE_URL}/${urlPath.INDEX_PATHS.CURRENT_VERSION}`;

const QUIZ_PATH = `${BASE_PATH}/auth/quizzes/create`;
const LOGIN = `${BASE_PATH}/auth/login`;

const loginSuite = {
  username: 'SuAdmin1',
  password: 'password123',
};

const quizSuite = {
  name: 'testQuiz',
  difficulty: 'easy',
  categoryId: 9,
  startDate: getCurrentDate(),
  totalQuestions: 10,
};

// Creating a seperate endDate to get correct end date comparison with startDate

const endDate = new Date(quizSuite.startDate);
endDate.setDate(endDate.getDate() + quizValues.QUIZ_DATES.addFive);
const isoEndDate = endDate.toISOString().split('T')[0];

// Quiz test will first login as a super admin and get token for auth
let authToken;

describe('Create a quiz', () => {
  it('should return a message no token provided', (done) => {
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(403);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('No token provided');
        done();
      });
  });

  it('should login as a super admin and get the auth token', (done) => {
    const { username, password } = loginSuite;
    chai
      .request(app)
      .post(LOGIN)
      .send({ username, password })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.token).to.be.a('string');
        authToken = res.body.token;
        done();
      });
  });

  it('should return a message Quiz name is required', (done) => {
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Quiz name is required');
        done();
      });
  });

  it('should return a message for quiz min length', (done) => {
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'a' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Quiz name should have a minimum length of 5');
        done();
      });
  });

  it('should return a message for quiz max length', (done) => {
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Quiz name should have a maximum length of 30');
        done();
      });
  });

  it('should return a message for quiz name only allow alpha characters', (done) => {
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'testQuiz1' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Quiz name should only contain alpha characters');
        done();
      });
  });

  it('should return a message difficulty required', (done) => {
    const { name } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Difficulty is required');
        done();
      });
  });

  it('should return a message difficulty needs to be easy,medium, hard', (done) => {
    const { name } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty: 'incorrect' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Difficulty must be of the following easy,medium,hard');
        done();
      });
  });

  it('should return a message start date must not be before current date', (done) => {
    const { name, difficulty, categoryId } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty, categoryId, startDate: '2000-01-01' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Start date must be greater than or equal to today in string format YYYY-MM-DD');
        done();
      });
  });

  it('should return a message end date must not be before or 5 days after startDate', (done) => {
    const { name, difficulty, categoryId, startDate } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty, categoryId, startDate, endDate: '2000-01-01' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai
          .expect(res.body.msg)
          .to.be.equal('End date must be greater than Start Date and no more than 5 days and in string format YYYY-MM-DD');
        done();
      });
  });

  it('should return a message for quiz total questions min length', (done) => {
    const { name, difficulty, categoryId, startDate } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty, categoryId, startDate, endDate: isoEndDate, totalQuestions: 4 })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Total Questions should have a minimum length of 10');
        done();
      });
  });

  it('should return a message for quiz total questions max length', (done) => {
    const { name, difficulty, categoryId, startDate } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty, categoryId, startDate, endDate: isoEndDate, totalQuestions: 15 })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Total Questions should have a maximum length of 10');
        done();
      });
  });

  it('should return a message quiz type to be boolean/mutiple', (done) => {
    const { name, difficulty, categoryId, startDate, totalQuestions } = quizSuite;
    chai
      .request(app)
      .post(`${QUIZ_PATH}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name, difficulty, categoryId, startDate, endDate: isoEndDate, totalQuestions, type: 'incorrect' })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('Type must contain multiple,boolean');
        done();
      });
  });
});

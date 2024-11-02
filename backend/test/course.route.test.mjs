import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Course Info API', () => {
  const testId = 'testing-course-info';

  it('should initialize the user info, including degree and major', (done) => {
    const degree = 'Science';
    const major = 'Data Science';
    request(app)
      .post('/v1/course/main')
      .query({ degree: degree, major: major, userId: testId })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);

        const responseData = res.body;
        expect(responseData.degree).to.equal(degree);
        expect(responseData.major).to.equal(major);
        expect(responseData.compulsory).to.deep.equal(['SCIE10005']);
        expect(responseData.majorCore).to.deep.equal([
          [4, 'MAST30025', 'MAST30027', 'MAST30034', 'COMP30027']
        ]);

        // Retrieve userId
        const userId = responseData.userId;
        expect(userId).to.be.a('string');

        done();
      });
  });
});

describe('Course Planner API', () => {
  const testId = 'test-course-planner';

  // Before all tests, create a user and get userId
  before((done) => {
    const degree = 'Science';
    const major = 'Data Science';
    request(app)
      .post('/v1/course/main')
      .query({ degree: degree, major: major, userId: testId })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);

        const responseData = res.body;
        const userId = responseData.userId;
        expect(userId).to.be.a('string');
        done();
      });
  });

  it('should add a subject to the planner', (done) => {
    const subjectData = {
      y1s2p1: {
        subjectCode: 'COMP20003',
        subjectName: 'Algorithms and Data Structures',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 2'],
        prerequisites: [['COMP10002', 'COMP20005']],
        corequisites: [],
        nonAllowedSubjects: ['COMP20007', 'COMP90038']
      }
    };

    request(app)
      .post(`/v1/course/user/${testId}/add`)
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');

        // Check the returned planner
        expect(res.body).to.have.property('planner');
        const planner = res.body.planner;
        expect(planner).to.have.property('y1s2');
        expect(planner['y1s2']).to.have.property('p1');
        expect(planner['y1s2']['p1']).to.have.property(
          'subjectCode',
          'COMP20003'
        );
        done();
      });
  });

  it('should validate the addition of a subject based on semester', (done) => {
    const subjectData = {
      y2s2p3: {
        subjectCode: 'MAST20006',
        subjectName: 'Probability for Statistics',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 1'],
        prerequisites: [],
        corequisites: [],
        nonAllowedSubjects: []
      }
    };

    request(app)
      .post(`/v1/course/user/${testId}/add`)
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('planner');
        const planner = res.body.planner;
        expect(planner).to.have.property('y2s2');
        expect(planner['y2s2']).to.have.property('p3');

        // The subject should have a semesterError because it's scheduled in the wrong semester
        const subjectEntry = planner['y2s2']['p3'];
        expect(subjectEntry).to.have.property('semesterError', true);

        done();
      });
  });

  it('should determine the type of subject (compulsory, core, discipline, breadth)', (done) => {
    const subjectData = {
      y1s2p2: {
        subjectCode: 'COMP20005',
        subjectName: 'Engineering Computation',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 1', 'Semester 2'],
        prerequisites: [['MATH10005']],
        corequisites: [],
        nonAllowedSubjects: []
      }
    };

    request(app)
      .post(`/v1/course/user/${testId}/add`)
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('planner');
        const planner = res.body.planner;
        expect(planner).to.have.property('y1s2');
        expect(planner['y1s2']).to.have.property('p2');
        const subjectEntry = planner['y1s2']['p2'];
        expect(subjectEntry)
          .to.have.property('header')
          .that.is.oneOf(['COMPULSORY', 'MAJOR CORE', 'DISCIPLINE', 'BREADTH']);
        done();
      });
  });
});

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Course Info API', () => {
  it('should initialize the user info, including degree and major', (done) => {
    const degree = 'Science';
    const major = 'Data Science';
    request(app)
      .post('/v1/course/main')
      .query({ degree: degree, major: major })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);

        const responseData = res.body;
        expect(responseData.degree).to.equal(degree);
        expect(responseData.major).to.equal(major);
        expect(responseData.compulsory).deep.equal(['SCIE10005']);
        expect(responseData.majorCore).deep.equal([
          [4, 'MAST30025', 'MAST30027', 'MAST30034', 'COMP30027']
        ]);
        // expect(res.body).to.have.property('userInfo');
        // expect(res.body.userDegree).to.deep.include({
        //   degree: 'Science',
        //   major: 'Data Science'
        // });
        // expect(res.body).to.have.property('coreSubjects').that.is.an('array');
        // expect(res.body)
        //   .to.have.property('compulsorySubject')
        //   .that.is.an('array');
        done();
      });
  });
});

describe('Course Planner API', () => {
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
      .post('/v1/course/user/:userId/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');

        // Since response is subjectPlanner
        expect(res.body).to.have.property('y1s2');
        expect(res.body['y1s2']).to.have.property('p1');
        expect(res.body['y1s2']['p1']).to.have.property(
          'subjectCode',
          'COMP20003'
        );
        done();
      });
  });

  it('should validate the addition of a subject based on semester', (done) => {
    const subjectData = {
      y2s2p3: {
        subjectCode: 'MAST20006', // This subject is only available in Semester 2
        subjectName: 'Probability for Statistics',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 1'],
        prerequisites: [], // TODO: this is not confirmed to be consistent with the database
        corequisites: [], // TODO: this is not confirmed to be consistent with the database
        nonAllowedSubjects: [] // TODO: this is not confirmed to be consistent with the database
      }
    };

    request(app)
      .post('/v1/course/user/:userId/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        // Validate response basic properties
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('y2s2');
        expect(res.body['y2s2']).to.have.property('p3');

        // Adding the subject in Semester 2 should trigger a semesterError
        const subjectEntry = res.body['y2s2']['p3'];
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
      .post('/v1/course/user/:userId/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');

        // The response is subjectPlanner
        expect(res.body).to.have.property('y1s2');
        expect(res.body['y1s2']).to.have.property('p2');
        const subjectEntry = res.body['y1s2']['p2'];
        expect(subjectEntry)
          .to.have.property('header')
          .that.is.oneOf(['COMPULSORY', 'MAJOR CORE', 'DISCIPLINE', 'BREADTH']);
        done();
      });
  });

  it('should remove a subject from the planner', (done) => {
    const term = 'y3s2';
    const position = 'p1';

    // First, add the subject so it can be removed
    const subjectData = {
      [`${term}${position}`]: {
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

    // Add the subject
    request(app)
      .post('/v1/course/user/:userId/add')
      .send(subjectData)
      .end((err) => {
        if (err) return done(err);

        // Now remove the subject
        request(app)
          .delete(`/v1/course/user/:userId/remove/${term}${position}`)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');

            // Response is subjectPlanner
            expect(res.body).to.have.property(term);
            expect(res.body[term]).to.have.property(position);
            expect(res.body[term][position]).to.be.empty;

            done();
          });
      });
  });
});

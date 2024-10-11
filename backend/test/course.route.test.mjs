import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Course Routes', () => {
  it('should retrieve core subjects and compulsory courses', (done) => {
    request(app)
      .get('/v1/course/main')
      .query({ majorName: 'ComputerScience', degree: 'Bachelor of Science' }) // Ensure these values exist in your database
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(
          'Core subjects and compulsory courses retrieved successfully'
        );
        expect(res.body).to.have.property('userDegree');
        expect(res.body.userDegree).to.deep.include({
          degree: 'Bachelor of Science',
          major: 'ComputerScience'
        });
        expect(res.body).to.have.property('coreSubjects').that.is.an('array');
        expect(res.body)
          .to.have.property('compulsorySubject')
          .that.is.an('array');
        done();
      });
  });

  it('should add a subject to the planner', (done) => {
    const subjectData = {
      '2024s2p1': {
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
      .post('/v1/course/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Subject added successfully.');
        expect(res.body).to.have.property('subjectPlanner');
        expect(res.body.subjectPlanner).to.have.property('2024s2');
        expect(res.body.subjectPlanner['2024s2']).to.have.property('p1');
        done();
      });
  });

  it('should validate the addition of a subject based on semester', (done) => {
    const subjectData = {
      '2024s1p1': {
        // Intentional mismatch in semester to trigger validation
        subjectCode: 'COMP20003',
        subjectName: 'Algorithms and Data Structures',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 2'], // The subject is available in Semester 2
        prerequisites: [['COMP10002', 'COMP20005']],
        corequisites: [],
        nonAllowedSubjects: ['COMP20007', 'COMP90038']
      }
    };

    request(app)
      .post('/v1/course/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);

        // Since the subject is added in Semester 1 but only available in Semester 2,
        // it should have a 'semesterError' property.

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        const subjectEntry = res.body.subjectPlanner['2024s1']['p1'];
        expect(subjectEntry).to.have.property('semesterError', true);
        done();
      });
  });

  it('should determine the type of subject (compulsory, core, discipline, breadth)', (done) => {
    const subjectData = {
      '2024s2p1': {
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
      .post('/v1/course/add')
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        const subjectEntry = res.body.subjectPlanner['2024s2']['p1'];
        expect(subjectEntry)
          .to.have.property('type')
          .that.is.oneOf(['compulsory', 'core', 'discipline', 'breadth']);
        done();
      });
  });

  it('should remove a subject from the planner', (done) => {
    const query = '2024s2p1';

    request(app)
      .delete(`/v1/course/remove/${query}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Subject removed successfully.');
        expect(res.body).to.have.property('subjectPlanner');
        expect(res.body.subjectPlanner['2024s2']).to.not.have.property('p1');
        done();
      });
  });
});

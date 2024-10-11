import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Course Routes', () => {
  it('should retrieve core subjects and compulsory courses', (done) => {
    request(app)
      .get('/v1/course/main') // updated route path
      .query({ majorName: 'Computer Science', degree: 'Science' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(
          'Core subjects and compulsory courses retrieved successfully'
        );
        done();
      });
  });

  it('should add a subject to the planner', (done) => {
    const subjectData = {
      '2024s2p1': {
        _id: '670493e5d277a6e6b1a447b4',
        subjectName: 'Algorithms and Data Structures',
        subjectCode: 'COMP20003',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        coordinator: {
          'Semester 2': [
            {
              name: 'lkulik',
              email: 'lkulik@unimelb.edu.au'
            }
          ]
        },
        subjectUrl: 'https://handbook.unimelb.edu.au/2024/subjects/comp20003',
        prerequisites: [['COMP10002', 'COMP20005']],
        corequisites: [],
        nonAllowedSubjects: ['COMP20007', 'COMP90038'],
        studyPeriod: ['Semester 2']
      }
    };

    request(app)
      .post('/v1/course/add') // updated route path
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Subject added successfully.');
        done();
      });
  });

  it('should validate the addition of a subject based on semester', (done) => {
    const subjectData = {
      '2024s2p1': {
        _id: '670493e5d277a6e6b1a447b4',
        subjectName: 'Algorithms and Data Structures',
        subjectCode: 'COMP20003',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        coordinator: {
          'Semester 2': [
            {
              name: 'lkulik',
              email: 'lkulik@unimelb.edu.au'
            }
          ]
        },
        subjectUrl: 'https://handbook.unimelb.edu.au/2024/subjects/comp20003',
        prerequisites: [['COMP10002', 'COMP20005']],
        corequisites: [],
        nonAllowedSubjects: ['COMP20007', 'COMP90038'],
        studyPeriod: ['Semester 2']
      }
    };

    request(app)
      .post('/v1/course/add') // updated route path for validation
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should determine the type of subject (compulsory, core, discipline, breadth)', (done) => {
    const subjectData = {
      '2024s2p1': {
        _id: '670493e5d277a6e6b1a447b4',
        subjectName: 'Algorithms and Data Structures',
        subjectCode: 'COMP20003',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        coordinator: {
          'Semester 2': [
            {
              name: 'lkulik',
              email: 'lkulik@unimelb.edu.au'
            }
          ]
        },
        subjectUrl: 'https://handbook.unimelb.edu.au/2024/subjects/comp20003',
        prerequisites: [['COMP10002', 'COMP20005']],
        corequisites: [],
        nonAllowedSubjects: ['COMP20007', 'COMP90038'],
        studyPeriod: ['Semester 2']
      }
    };

    request(app)
      .post('/v1/course/add') // path used for adding and determining type
      .send(subjectData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('2024s2p1');
        expect(res.body['2024s2p1'])
          .to.have.property('type')
          .that.is.oneOf(['compulsory', 'core', 'discipline', 'breadth']);
        done();
      });
  });

  it('should remove a subject from the planner', (done) => {
    const query = '2024s2p1';

    request(app)
      .delete(`/v1/course/remove/${query}`) // updated route path
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Subject removed successfully.');
        done();
      });
  });
});

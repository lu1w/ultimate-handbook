// import request from 'supertest';
// import { expect } from 'chai';
// import app from '../src/app.js';

// it('should retrieve core subjects and compulsory courses', () => {
//   // request(app)
//   //   .get('/v1/course/main')
//   //   .query({ majorName: 'Computer Science', degree: 'Bachelor of Science' }) // Adjusted values
//   //   .end((err, res) => {
//   //     if (err) return done(err);
//   //     expect(res.body).to.be.an('object');
//   //     expect(res.body.message).to.equal(
//   //       'Core subjects and compulsory courses retrieved successfully'
//   //     );
//   //     expect(res.body).to.have.property('userDegree');
//   //     expect(res.body.userDegree).to.deep.include({
//   //       degree: 'Bachelor of Science',
//   //       major: 'Computer Science'
//   //     });
//   //     expect(res.body).to.have.property('coreSubjects').that.is.an('array');
//   //     expect(res.body)
//   //       .to.have.property('compulsorySubject')
//   //       .that.is.an('array');
//   //     done();
//   //   });
//   it('should add a subject to the planner', (done) => {
//     const subjectData = {
//       '2024s2p1': {
//         subjectCode: 'COMP20003',
//         subjectName: 'Algorithms and Data Structures',
//         level: 2,
//         points: 12.5,
//         location: 'On Campus (Parkville)',
//         studyPeriod: ['Semester 2'],
//         prerequisites: [['COMP10002', 'COMP20005']],
//         corequisites: [],
//         nonAllowedSubjects: ['COMP20007', 'COMP90038']
//       }
//     };

//     request(app)
//       .post('/v1/course/add')
//       .send(subjectData)
//       .end((err, res) => {
//         if (err) return done(err);

//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('object');

//         // Since response is subjectPlanner
//         expect(res.body).to.have.property('2024s2');
//         expect(res.body['2024s2']).to.have.property('p1');
//         expect(res.body['2024s2']['p1']).to.have.property(
//           'subjectCode',
//           'COMP20003'
//         );
//         done();
//       });
//   });

//   it('should validate the addition of a subject based on semester', (done) => {
//     const subjectData = {
//       '2024s1p1': {
//         subjectCode: 'COMP20003', // This subject is only available in Semester 2
//         subjectName: 'Algorithms and Data Structures',
//         level: 2,
//         points: 12.5,
//         location: 'On Campus (Parkville)',
//         studyPeriod: ['Semester 2'], // So adding it in Semester 1 should trigger a semesterError
//         prerequisites: [['COMP10002', 'COMP20005']],
//         corequisites: [],
//         nonAllowedSubjects: ['COMP20007', 'COMP90038']
//       }
//     };

//     request(app)
//       .post('/v1/course/add')
//       .send(subjectData)
//       .end((err, res) => {
//         if (err) return done(err);

//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('object');

//         // The response is subjectPlanner
//         expect(res.body).to.have.property('2024s1');
//         expect(res.body['2024s1']).to.have.property('p1');
//         const subjectEntry = res.body['2024s1']['p1'];
//         expect(subjectEntry).to.have.property('semesterError', true);
//         done();
//       });
//   });

//   it('should determine the type of subject (compulsory, core, discipline, breadth)', (done) => {
//     const subjectData = {
//       '2024s2p2': {
//         subjectCode: 'COMP20005',
//         subjectName: 'Engineering Computation',
//         level: 2,
//         points: 12.5,
//         location: 'On Campus (Parkville)',
//         studyPeriod: ['Semester 1', 'Semester 2'],
//         prerequisites: [['MATH10005']],
//         corequisites: [],
//         nonAllowedSubjects: []
//       }
//     };

//     request(app)
//       .post('/v1/course/add')
//       .send(subjectData)
//       .end((err, res) => {
//         if (err) return done(err);

//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('object');

//         // The response is subjectPlanner
//         expect(res.body).to.have.property('2024s2');
//         expect(res.body['2024s2']).to.have.property('p2');
//         const subjectEntry = res.body['2024s2']['p2'];
//         expect(subjectEntry)
//           .to.have.property('type')
//           .that.is.oneOf(['compulsory', 'core', 'discipline', 'breadth']);
//         done();
//       });
//   });

//   it('should remove a subject from the planner', (done) => {
//     const query = '2024s2p1';

//     // First, add the subject so it can be removed
//     const subjectData = {
//       '2024s2p1': {
//         subjectCode: 'COMP20003',
//         subjectName: 'Algorithms and Data Structures',
//         level: 2,
//         points: 12.5,
//         location: 'On Campus (Parkville)',
//         studyPeriod: ['Semester 2'],
//         prerequisites: [['COMP10002', 'COMP20005']],
//         corequisites: [],
//         nonAllowedSubjects: ['COMP20007', 'COMP90038']
//       }
//     };

//     // Add the subject
//     request(app)
//       .post('/v1/course/add')
//       .send(subjectData)
//       .end((err) => {
//         if (err) return done(err);

//         // Now remove the subject
//         request(app)
//           .delete(`/v1/course/remove/${query}`)
//           .end((err, res) => {
//             if (err) return done(err);

//             expect(res.status).to.equal(200);
//             expect(res.body).to.be.an('object');

//             // Response is subjectPlanner
//             expect(res.body).to.have.property('2024s2');
//             expect(res.body['2024s2']).to.not.have.property('p1');
//             done();
//           });
//       });
//   });
// });

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Course Planner API Tests', () => {
  it('should retrieve core subjects and compulsory courses', (done) => {
    request(app)
      .get('/v1/course/main')
      .query({ majorName: 'Computer Science', degree: 'Bachelor of Science' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal(
          'Core subjects and compulsory courses retrieved successfully'
        );
        expect(res.body).to.have.property('userDegree');
        expect(res.body.userDegree).to.deep.include({
          degree: 'Bachelor of Science',
          major: 'Computer Science'
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
      .post('/v1/course/add')
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
      y1s1p1: {
        subjectCode: 'COMP20003', // This subject is only available in Semester 2
        subjectName: 'Algorithms and Data Structures',
        level: 2,
        points: 12.5,
        location: 'On Campus (Parkville)',
        studyPeriod: ['Semester 2'], // So adding it in Semester 1 should trigger a semesterError
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

        // The response is subjectPlanner
        expect(res.body).to.have.property('y1s1');
        expect(res.body['y1s1']).to.have.property('p1');
        const subjectEntry = res.body['y1s1']['p1'];
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
      .post('/v1/course/add')
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
          .to.have.property('type')
          .that.is.oneOf(['compulsory', 'core', 'discipline', 'breadth']);
        done();
      });
  });

  it('should remove a subject from the planner', (done) => {
    const query = 'y1s2p1';

    // First, add the subject so it can be removed
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

    // Add the subject
    request(app)
      .post('/v1/course/add')
      .send(subjectData)
      .end((err) => {
        if (err) return done(err);

        // Now remove the subject
        request(app)
          .delete(`/v1/course/remove/${query}`)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');

            // Response is subjectPlanner
            expect(res.body).to.have.property('y1s2');
            expect(res.body['y1s2']).to.have.property('p1');
            expect(res.body['y1s2']['p1']).to.be.empty;
            done();
          });
      });
  });
});

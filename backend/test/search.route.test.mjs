import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

import { StudyPeriod } from '../src/lib/constants.js';

const validateResponseFields = (res) => {
  expect(res.body).to.be.an('object');
  expect(res.body.subjects).to.be.an('array');
};

const validateSubjectField = (subject) => {
  expect(subject).to.have.property('_id');
  expect(subject).to.have.property('subjectName').that.is.a('string');
  expect(subject).to.have.property('subjectCode').that.is.a('string');
  expect(subject).to.have.property('level').that.is.a('number');
  expect(subject).to.have.property('points').that.is.a('number');
  expect(subject).to.have.property('location').that.is.a('string');
  expect(subject).to.have.property('coordinator').that.is.an('object');
  expect(subject).to.have.property('subjectUrl').that.is.a('string');
  expect(subject).to.have.property('prerequisites').that.is.an('array');
  expect(subject).to.have.property('corequisites').that.is.an('array');
  expect(subject).to.have.property('nonAllowedSubjects').that.is.an('array');
  expect(subject).to.have.property('studyPeriod').that.is.an('array');
};

const allLevels = [1, 2, 3];
const allStudyPeriods = Object.values(StudyPeriod);
const defaultStudyAreas = ['COMP', 'MAST', 'BIOL', 'CHEM', 'SWEN', 'INFO'];

const urlWithQuery = ({
  input = '',
  levels = allLevels,
  studyPeriods = allStudyPeriods,
  studyAreas = defaultStudyAreas
}) => {
  const url =
    `/v1/search/conditions?input=` +
    input +
    `&levels=${levels.toString()}&studyPeriods=${studyPeriods.toString()}&studyAreas=${studyAreas.toString()}`;
  console.log('Testing!! ----- ');
  console.log('input: ' + input);
  console.log('input.toString(): ' + input.toString());
  console.log(`empty string: ${''}`);
  return url;
};

describe('Search Routes: search page', () => {
  it('load all subject when entering the search page', (done) => {
    request(app)
      .get('/v1/search/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err); // if error, fail with err

        validateResponseFields(res);
        expect(res.body.subjects).to.be.not.empty;

        // const subject = res.body.subjects[0];
        // validateSubjectField(subject);

        // TODO: remove the following if once the database has been fixed
        // if (res.body.subjects.length > 0) {
        //   const subject = res.body.subjects[0];
        //   validateSubjectField(subject);
        // }

        return done();
      })
      .timeout(5000);
  });
});

describe('Search Routes: search query', () => {
  it('search for a subject by subject code (hard coded url)', (done) => {
    request(app)
      .get(
        '/v1/search/conditions?input=comp&levels=2&studyPeriods=Summer_Term,Semester_1,Winter_Term,Semester_2&studyAreas=BMEN,ANSC'
      )
      .expect(200)
      .end((err, res) => {
        if (err) return done(err); // if error, fail with err

        validateResponseFields(res);
        expect(res.body.subjects).to.have.lengthOf(3);

        const subject = res.body.subjects[0];
        validateSubjectField(subject);

        return done();
      })
      .timeout(5000);
  });

  it('search for a subject by subject code', (done) => {
    request(app)
      .get(urlWithQuery({ input: 'COMP10002' }))
      .expect(200)
      .end((err, res) => {
        if (err) return done(err); // if error, fail with err

        validateResponseFields(res);
        expect(res.body.subjects).to.have.lengthOf(1);

        const subject = res.body.subjects[0];
        validateSubjectField(subject);

        // TODO: remove the following if once the database has been fixed
        // if (res.body.subjects.length > 0) {
        //   const subject = res.body.subjects[0];
        //   validateSubjectField(subject);
        // }

        return done();
      })
      .timeout(5000);
  });

  it('search for a subject by subject name', (done) => {
    request(app)
      .get(urlWithQuery({ input: 'linear algebra' }))
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        validateResponseFields(res);
        expect(res.body.subjects).to.be.not.empty;

        for (let subject of res.body.subjects) {
          validateSubjectField(subject);
        }
        return done();
      })
      .timeout(5000);
  });
});

describe('Search Routes: search filter', () => {
  it('search for a subejct based on filter constraints with an input query', (done) => {
    request(app)
      .get(
        urlWithQuery({
          input: 'foundation',
          levels: [1],
          studyPeriods: [StudyPeriod.sem1]
        })
      )
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        validateResponseFields(res);
        expect(res.body.subjects).to.have.lengthOf(5);

        for (let subject of res.body.subjects) {
          validateSubjectField(subject);
          expect(subject.level === 1);
          expect(subject.subjectCode.substring(0, 4) in defaultStudyAreas);
        }
        return done();
      })
      .timeout(5000);
  });

  it('search for a subejct based on filter constraints without input query', (done) => {
    request(app)
      .get(
        urlWithQuery({
          levels: [1, 2],
          studyPeriods: [StudyPeriod.summer],
          studyAreas: ['MATH']
        })
      )
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        validateResponseFields(res);
        expect(res.body.subjects).to.have.lengthOf(4);

        for (let subject of res.body.subjects) {
          validateSubjectField(subject);
          expect(subject.level in [1, 2]);
          expect(subject.subjectCode.substring(0, 4) == 'MATH');
        }
        return done();
      })
      .timeout(5000);
  });
});

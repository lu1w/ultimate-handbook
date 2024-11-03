// negative.test.js

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Negative Tests for Course Planner API', () => {
  const testUserId = 'negative-test-user';

  // Initialize user info before running tests
  before(async () => {
    // Initialize user with valid degree and major
    const degree = 'Science';
    const major = 'Data Science';

    await request(app)
      .post('/v1/course/main')
      .query({ degree: degree, major: major, userId: testUserId })
      .expect(200);
  });

  describe('Set Basic Info Negative Tests', () => {
    it('should return error when initializing without degree and major', async () => {
      // Attempt to initialize user info without degree and major
      const res = await request(app)
        .post('/v1/course/main')
        .query({ userId: 'test-user-no-degree-major' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Degree and major are required.');
    });

    it('should return error when initializing with invalid degree', async () => {
      // Attempt to initialize user info with an invalid degree
      const res = await request(app).post('/v1/course/main').query({
        degree: 'InvalidDegree',
        major: 'Data Science',
        userId: 'test-user-invalid-degree'
      });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Degree not found.');
    });

    it('should return error when initializing with invalid major', async () => {
      // Attempt to initialize user info with an invalid major
      const res = await request(app).post('/v1/course/main').query({
        degree: 'Science',
        major: 'InvalidMajor',
        userId: 'test-user-invalid-major'
      });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Major not found.');
    });
  });

  describe('Add Subject Negative Tests', () => {
    it('should return error when adding subject without subjectData', async () => {
      // Attempt to add a subject without providing subjectData
      const res = await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('No subject info for adding new subject');
    });

    it('should return error when adding subject to invalid slot', async () => {
      // Attempt to add a subject to a slot that doesn't exist in the planner
      const subjectData = {
        invalidSlot: {
          subjectCode: 'COMP20003',
          subjectName: 'Algorithms and Data Structures',
          level: 2,
          points: 12.5
          // Other necessary fields...
        }
      };

      const res = await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send(subjectData);

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Invalid time or position');
    });

    it('should return error when adding subject without subjectCode', async () => {
      // Attempt to add a subject without providing subjectCode
      const subjectData = {
        y1s2p1: {
          // subjectCode is missing
          subjectName: 'Algorithms and Data Structures',
          level: 2,
          points: 12.5
          // Other necessary fields...
        }
      };

      const res = await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send(subjectData);

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Missing subject code');
    });

    it('should return error when adding a duplicate subject to the planner', async () => {
      // First, add a subject to the planner
      const subjectData = {
        y1s2p1: {
          subjectCode: 'COMP20003',
          subjectName: 'Algorithms and Data Structures',
          level: 2,
          points: 12.5
          // Other necessary fields...
        }
      };

      await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send(subjectData)
        .expect(200);

      // Attempt to add the same subject again
      const duplicateSubjectData = {
        y2s1p1: {
          subjectCode: 'COMP20003', // Same subject code
          subjectName: 'Algorithms and Data Structures',
          level: 2,
          points: 12.5
          // Other necessary fields...
        }
      };

      const res = await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send(duplicateSubjectData);

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal(
        'Subject COMP20003 already exists in the planner'
      );
    });

    it('should return error when adding subject to an occupied slot', async () => {
      // Attempt to add a subject to a slot that is already occupied
      const subjectData = {
        y1s2p1: {
          subjectCode: 'COMP20005',
          subjectName: 'Engineering Computation',
          level: 2,
          points: 12.5
          // Other necessary fields...
        }
      };

      const res = await request(app)
        .post(`/v1/course/user/${testUserId}/add`)
        .send(subjectData);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.include('Subject already exist in the slot');
    });
  });

  describe('Remove Subject Negative Tests', () => {
    it('should return error when removing subject from invalid slot', async () => {
      // Attempt to remove a subject from an invalid slot identifier
      const res = await request(app).delete(
        `/v1/course/user/${testUserId}/remove/invalidSlot`
      );

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid slot provided.');
    });
  });
});

import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Progression rule: Bachelor of Science', () => {
  it('display correct progression check for empty planner', (done) => {
    request(app)
      .post('/v1/course/main')
      .query({ degree: 'Science', major: 'Data Science' })
      // .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);

        request(app)
          .get('/v1/course/user/:userId/progressions')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            const responseData = res.body;

            expect(responseData).to.be.an('object');
            expect(responseData).to.include.all.keys(
              'overall',
              'discipline',
              'breadth',
              'degreeProgression'
            );

            /* check the filds within each requirements */
            ['overall', 'discipline', 'breadth'].forEach((category) => {
              Object.keys(responseData[category]).forEach((level) => {
                /* number of credit points should be 0 */
                // expect(responseData[category][level].stats.charAt(0)).equal(
                //   '0'
                // );
                expect(responseData[category][level].fulfilled).to.be.a(
                  'boolean'
                );
              });
            });

            done();
          });

        // return done();
      })
      .timeout(1000);
  });
});

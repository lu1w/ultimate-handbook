import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Progression rule: Bachelor of Science', () => {
  it('display correct progression check for empty planner', (done) => {
    const testId = 'testing-progression';

    request(app)
      .post('/v1/course/main')
      .query({ degree: 'Science', major: 'Data Science', userId: testId })
      // .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);

        request(app)
          .get(`/v1/course/user/${testId}/progressions`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            const responseBody = res.body;
            console.log('respond data == ' + JSON.stringify(responseBody));

            expect(responseBody).to.be.an('object');
            expect(responseBody.progressions).to.include.all.keys(
              'general',
              'levelsRules'
            );
            expect(responseBody.progressions.levelsRules).to.include.all.keys(
              'overall',
              'discipline',
              'breadth',
              'degreeProgression',
              'distinctStudyArea'
            );

            /* check the filds within each requirements */
            ['overall', 'discipline', 'breadth'].forEach((category) => {
              const categoryInfo =
                responseBody.progressions.levelsRules[category];

              Object.keys(categoryInfo).forEach((level) => {
                /* number of credit points should be 0 */
                // expect(responseData[category][level].stats.charAt(0)).equal(
                //   '0'
                // );
                expect(categoryInfo[level].fulfilled).to.be.a('boolean');
              });
            });

            done();
          });

        // return done();
      })
      .timeout(1000);
  });
});

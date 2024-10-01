import request from 'supertest'; 
import { expect } from 'chai'; 
import app from '../src/app.js'; 

describe("Search Routes", () => {
  
  it("should search for a subject by query", (done) => {
    const query = "COMP10002"; // search for COMP10002
    request(app)
      .get(`/v1/search/subject/${query}`) // GET request
      .end((err, res) => { // then pass values to the end/callback function
        // make sure there is no error
        if (err) return done(err);

        expect(res.status).to.equal(200);

        expect(res.body).to.be.an("object");

        // assert the subjects property is an array
        expect(res.body).to.have.property("subjects").that.is.an("array");

        // make sure the subejct structure is correct
        if (res.body.subjects.length > 0) {
          expect(res.body.subjects[0]).to.have.property("subjectName");
          expect(res.body.subjects[0]).to.have.property("subjectCode");
        }

        done(); 
      });
  });
});

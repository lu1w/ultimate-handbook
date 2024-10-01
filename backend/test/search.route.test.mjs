import request from 'supertest'; 
import { expect } from 'chai'; 
import app from '../src/app.js'; 


describe("Search Routes", () => {
  
  it("should search for a subject by query", function (done)  {
    this.timeout(5000); // set timeout to 5 seconds
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
          const subject = res.body.subjects[0];
          expect(subject).to.have.property("_id");
          expect(subject).to.have.property("subjectName").that.is.a("string");
          expect(subject).to.have.property("subjectCode").that.is.a("string");
          expect(subject).to.have.property("level").that.is.a("number");
          expect(subject).to.have.property("points").that.is.a("number");
          expect(subject).to.have.property("location");
          expect(subject).to.have.property("subjectUrl").that.is.a("string");
          expect(subject).to.have.property("prerequisites").that.is.an("array");
          expect(subject).to.have.property("corequisites").that.is.an("array");
          expect(subject).to.have.property("nonAllowedSubjects").that.is.an("array");
        }

        done(); 
      });
  });
});

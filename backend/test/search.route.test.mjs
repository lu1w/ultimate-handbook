
import request from 'supertest'; 
import { expect } from 'chai';
import app from '../src/app.js'; 
describe("Search Routes", () => {
  it("should search for a subject by query", (done) =>{
    const query = "COMP10002";
    request(app)
      .get(`/v1/search/subject/${query}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.subjects).to.be.an("array");

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
      }).timeout(10000);
  });
});

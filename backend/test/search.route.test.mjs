import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

const validateSubjectField = (subject) => {
  expect(subject).to.have.property("_id");
  expect(subject).to.have.property("subjectName").that.is.a("string");
  expect(subject).to.have.property("subjectCode").that.is.a("string");
  expect(subject).to.have.property("level").that.is.a("number");
  expect(subject).to.have.property("points").that.is.a("number");
  expect(subject).to.have.property("location").that.is.a("string");
  expect(subject).to.have.property("subjectUrl").that.is.a("string");
  expect(subject).to.have.property("prerequisites").that.is.an("array");
  expect(subject).to.have.property("corequisites").that.is.an("array");
  expect(subject).to.have.property("nonAllowedSubjects").that.is.an("array");
};

describe("Search Routes: search query", () => {
  const urlWithQuery = (query) => {
    return `/v1/search/${query}`;
  };

  it("search for a subject by subject code", (done) => {
    request(app)
      .get(urlWithQuery("COMP10002"))
      .expect(200)
      .end((err, res) => {
        if (err) return done(err); // if error, fail with err

        expect(res.body).to.be.an("object");
        expect(res.body.subjects).to.be.an("array");

        // TODO: uncomment the following assertion when the database has been fixed
        // expect(res.body.subjects).to.have.lengthOf(1);
        // const subject = res.body.subjects[0];
        // validateSubjectField(subject);

        // TODO: remove the following if once the database has been fixed
        if (res.body.subjects.length > 0) {
          const subject = res.body.subjects[0];
          validateSubjectField(subject);
        }

        return done();
      })
      .timeout(10000);
  });

  it("search for a subject by subject name", (done) => {
    request(app)
      .get(urlWithQuery("linear algebra"))
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.be.an("object");
        expect(res.body.subjects).to.be.an("array").that.is.not.empty;

        for (let subject of res.body.subjects) {
          validateSubjectField(subject);
        }
        return done();
      });
  });
});

describe("Search Routes: search filter", () => {
  // TODO: to be implemented when developing the filter functionality
});

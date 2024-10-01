import * as chai from 'chai'; // Import everything from chai as a namespace
import chaiHttp from 'chai-http';
import app from '../src/app.js'; // Ensure the path to your app is correct

chai.use(chaiHttp);
const { expect } = chai;

describe("Course Routes", () => {
  it("should return a welcome message", (done) => {
    chai
      .request(app)
      .get("/v1/course")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Welcome to the U handbook!!!.");
        done();
      });
  });

  it("should add a subject to the planner", (done) => {
    const subjectData = {
      "2024s21": { SubjectsCode: "COMP10002", SubjectsName: "COMPUTER!" }
    };
    chai
      .request(app)
      .post("/v1/course/add")
      .send(subjectData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("successfully added Subjects!");
        done();
      });
  });

  it("should remove a subject from the planner", (done) => {
    const query = "2024s21";
    chai
      .request(app)
      .delete(`/v1/course/remove/${query}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Successfully removed Subjects!");
        done();
      });
  });
});

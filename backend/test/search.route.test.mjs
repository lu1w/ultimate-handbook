import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js'; // 确保路径正确

chai.use(chaiHttp);
const { expect } = chai;

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../src/app'); // 引入你的 Express 应用
// chai.use(chaiHttp);
// const { expect } = chai;


describe("Search Routes", () => {
  it("should get all subjects", (done) => {
    chai
      .request(app)
      .get("/v1/search")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
  it("should search for a subject by query", (done) => {
    const query = "COMP10002";
    chai
      .request(app)
      .get(`/v1/search/subject/${query}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.subjects).to.be.an("array");
        done();
      });
  });
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import CourseCard from './components/CourseCard';
import './index.css';
import { Container, Row, Col } from 'react-bootstrap';
import courseData from './mock-data/courseData'; // Import the dictionary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Container>
    <Row>
      {courseData.map((course, index) => (
        <Col md={4} key={index}>
          <CourseCard type={course.type} code = {course.code} level = {course.level}
                      name={course.name} points={course.points} />
        </Col>
      ))}
    </Row>
  </Container>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import courseData from './mock-data/courseData'; // Import the dictionary
import CourseCard from './components/Common/CourseCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Container>
    <Row>
      {courseData.map((course, index) => (
        <Col md={4} key={index}>
          <CourseCard type={course.type} code = {course.code} level = {course.level}
                      name={course.name} points={course.points} term = {course.term}/>
        </Col>
      ))}
    </Row>
  </Container>
);

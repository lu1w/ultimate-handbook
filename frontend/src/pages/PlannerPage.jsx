import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // TODO: make the contianer into another component?

/* Import components */
import courseData from '../mock-data/courseData'; // Import the dictionary
import CourseCard from '../components/Common/CourseCard';

function PlannerPage() {
  return (
    <Container>
      <Row>
        {courseData.map((course, index) => (
          <Col md={4} key={index}>
            <CourseCard
              type={course.type}
              code={course.code}
              level={course.level}
              name={course.name}
              points={course.points}
              term={course.term}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PlannerPage;

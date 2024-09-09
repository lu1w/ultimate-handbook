import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; // TODO: make the contianer into another component? 

/* Import components */
import PlannerPage from './pages/PlannerPage'; 
import SearchPage from './pages/SearchPage';

import courseData from './mock-data/courseData'; // Import the dictionary
import CourseCard from './components/Common/CourseCard';

function App() {
  return <div>
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

    <Routes>
      {/* NOTE: the home path '/' can be the loading page, or the page where we ask user questions about their enrollment */}
      <Route path='/' element='' /> 
      <Route path='/planner' element={<PlannerPage />} />
      <Route path='/search' element={<SearchPage />} />
    </Routes>
    
  </div>
}

export default App; 
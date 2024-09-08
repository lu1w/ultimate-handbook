import React from "react";
import SearchBar from "./components/Search/SearchBar";

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
    <SearchBar /> 
    </div>
}

export default App; 
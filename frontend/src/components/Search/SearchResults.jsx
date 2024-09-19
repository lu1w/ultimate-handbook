import React from 'react';
import PropTypes from 'prop-types';

function SearchResults({ searchResults }) {
  return (
    <div>
      <h1>Subjects:{searchResults}</h1>
      {/* {searchResults.map((subject, index) => (
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
    ))} */}
    </div>
  );
}

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.element),
};

export default SearchResults;

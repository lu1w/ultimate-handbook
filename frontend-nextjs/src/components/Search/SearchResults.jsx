import '@styles/SearchResults.css';

import React from 'react';
import PropTypes from 'prop-types';

import SubjectCard from '@components/common/subjectCard';

function SearchResults({ searchResults }) {
  // let subject = searchResults[0];
  return (
    <div className="p-10 flex flex-wrap gap-10">
      {/* <h1>Subjects:{JSON.stringify(searchResults)}</h1> */}
      {searchResults.map((subject) => (
        <SubjectCard
          // key={subject._id}
          type="DISCIPLINE" // TODO: dynamically set the type of the subject
          code={subject.subjectCode}
          level={subject.level}
          name={subject.subjectName}
          points={subject.points}
          term={
            subject.availability // TODO: ask Weihan why are some subject availability empty
              ? subject.availability.map((t) => t.toString())
              : []
          }
        />
      ))}
    </div>
  );
}

SearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.element),
};

export default SearchResults;

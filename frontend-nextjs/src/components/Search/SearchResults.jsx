// import '@styles/SearchResults.css';

import React from 'react';
import PropTypes from 'prop-types';

import SubjectCard from '@/components/common/subjectCard';

function SearchResults({ subjects }) {
  // let subject = searchResults[0];
  console.log(
    `INFO: searchResults passed into SearchResuitls<> is ${JSON.stringify(subjects)}`,
  );
  return (
    <div>
      <p className="w-full text-center bg-search-muted text-white p-2">
        {subjects.length} results found
        {/* {query
          ? `${subjects.length} results found`
          : 'please enter your subject'} */}
      </p>
      <div className="p-10 grid grid-cols-4 gap-5">
        {/* <h1>Subjects:{JSON.stringify(subjects)}</h1> */}
        {subjects.map((subject) => (
          <SubjectCard
            key={subject._id}
            // TODO: dynamically set the type of the subject, potentially mapping code to study areaø
            type={subject.subjectCode.substring(0, 4)}
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
    </div>
  );
}

SearchResults.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.element),
  query: PropTypes.string,
};

export default SearchResults;

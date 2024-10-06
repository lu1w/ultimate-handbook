import React from 'react';
import PropTypes from 'prop-types';

import FilterHeader from '@/components/search/filterHeader';
import Filter from '@/components/search/filter';

function SearchFilters({ handleCheck }) {
  return (
    <div className="bg-gray-100 px-4 rounded-lg">
      <FilterHeader header="Levels" />
      <Filter text="Level 1" handleCheck={handleCheck} />
      <Filter text="Level 2" handleCheck={handleCheck} />
      <Filter text="Level 3" handleCheck={handleCheck} />

      <FilterHeader header="Available Semester/Term" />
      <Filter text="Summer Term" handleCheck={handleCheck} />
      <Filter text="Semester 1" handleCheck={handleCheck} />
      <Filter text="Winter Term" handleCheck={handleCheck} />
      <Filter text="Semester 2" handleCheck={handleCheck} />

      <FilterHeader header="Study Area" />
      <Filter text="BIOL" handleCheck={handleCheck} />
      <Filter text="CHEM" handleCheck={handleCheck} />
      <Filter text="COMP" handleCheck={handleCheck} />
      <Filter text="MAST" handleCheck={handleCheck} />
    </div>
  );
}
SearchFilters.propTypes = {
  handleCheck: PropTypes.func.isRequired,
};

export default SearchFilters;

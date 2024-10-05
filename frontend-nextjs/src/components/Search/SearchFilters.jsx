import React from 'react';
import PropTypes from 'prop-types';

import Filter from '@components/Search/filter';

import { Checkbox } from '@components/ui/checkbox';

function SearchFilters({ handleCheck }) {
  return (
    <div>
      <h1>Filters</h1>

      <h2>Levels</h2>
      <Filter id="lv1" text="Level 1" handleCheck={handleCheck} />
      <Filter id="lv2" text="Level 2" handleCheck={handleCheck} />
      <Filter id="lv3" text="Level 3" handleCheck={handleCheck} />

      <h2>Available Semester/Term</h2>
      <Filter id="summer" text="Summer Term" handleCheck={handleCheck} />
      <Filter id="sem1" text="Semester 1" handleCheck={handleCheck} />
      <Filter id="winter" text="Winter Term" handleCheck={handleCheck} />
      <Filter id="sem2" text="Semester 2" handleCheck={handleCheck} />

      <h3>Study Area</h3>
      <label htmlFor="level1" className="text-sm font-medium leading-10 p-2">
        <Checkbox id="level1" onClick={handleCheck} defaultChecked />
        Computer Science
      </label>
    </div>
  );
}
SearchFilters.propTypes = {
  handleCheck: PropTypes.func.isRequired, // Must be a function and is required
};

export default SearchFilters;

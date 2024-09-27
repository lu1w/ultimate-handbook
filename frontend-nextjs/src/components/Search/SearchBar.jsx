import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@/components/common/button';
import { Input } from '@components/ui/input';
// import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

function SearchBar({ handleSubmit, handleChange, input }) {
  return (
    <div id="search-bar" className="p-5 bg-search-header text-white">
      <form className="flex gap-4" onSubmit={handleSubmit}>
        {/* <MagnifyingGlassIcon className="inline z-50 ml-10 h-8 w-4 icon" /> */}
        <Input
          onChange={handleChange}
          type="text"
          placeholder="Search subjects"
          value={input}
        />
        <Button variant="search" size="search" type="Submit">
          Search
        </Button>
      </form>
    </div>
  );
}

SearchBar.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // Must be a function and is required
  handleChange: PropTypes.func.isRequired, // Must be a function and is required
  input: PropTypes.string.isRequired, // Must be a string and is required
};

export default SearchBar;

import '../../styles/SearchBar.css';

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

function SearchBar({ handleSubmit, handleChange, input }) {
  return (
    <div id="search-bar">
      <form onSubmit={handleSubmit}>
        <MagnifyingGlassIcon className="inline z-50 ml-20 h-8 w-4 icon" />
        <Input
          onChange={handleChange}
          type="text"
          placeholder="Search subjects"
          value={input}
        />
        <Button classname="button" variant="search" type="Submit">
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

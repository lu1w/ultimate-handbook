import React from 'react';
import SearchBar from '../components/Search/SearchBar';
import SearchFilters from '../components/Search/SearchFilters';
import SearchResults from '../components/Search/SearchResults';

import axios from 'axios';

function SearchPage() {
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState([
    'INFO: please enter your search prompt',
  ]);

  function handleChange(event) {
    console.log(
      `INFO handleChange(): event.target.value: ${event.target.value}`,
    );
    setInput(event.target.value);
  }

  async function handleSubmit(event) {
    console.log(`INFO handleSubmit()`);
    event.preventDefault(); // prevent the default refresh behavior of the event from the <form> element
    console.log('INFO handleSearch()');

    // Send the input query to the backend for database access
    try {
      console.log(`INFO try sending query ${input} to the backend`);
      const res = await axios.get(
        'http://localhost:4000/v1/search/subject/' + input,
      );
      setResult(res.data.subjects);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  }

  return (
    <div>
      <SearchBar
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        input={input}
      />
      <p>{JSON.stringify(result)}</p>
      <SearchFilters />
      <SearchResults />
    </div>
  );
}

export default SearchPage;

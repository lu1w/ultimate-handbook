import React from 'react';
import axios from 'axios';

function SearchBar() {
  const [input, setInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState(""); 

  function handleChange(event) {
    console.log(`INFO event value when change: ${event.target.value}`);
    setInput(event.target.value);
    console.log(`INFO input after change: ${input}`);
  }

  function handleSubmit(event) {
    setQuery(input);
    console.log(`INFO query after change: ${query}`);
    // Sending request to the backend 
    handleSearch(); 
    event.preventDefault(); // prevent the default refresh behavior of the event from the <form>
  }

  // Function to handle the search request
  async function handleSearch() {
    console.log("INFO enter handleSearch()"); 

    try {
      console.log(`INFO try sending query ${query} to the backend`); 
      const res = await axios.get('http://localhost:3000/search/subject', { query }); 
      console.log(`INFO response: ${res}`); 
      setResult(res.data); 
      console.log(`INFO result after getting response: ${result}`); 

      // const response = await axios.get('http://localhost:3000/search', {
      //     params: { query }, // Pass the query as a parameter
      // });
      // setResults(response.data); // Set the response data as the results
      // setError(null); // Clear any previous errors
    } catch (err) {
        console.error('Error fetching subjects:', err);
        // setError('Failed to fetch subjects. Please try again later.');
    }
  }; 

  return (
    <div onSubmit={handleSubmit}>
      <h1>Searching: {query}</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="Enter your subject"
          value={input}
        /> 
        <button type="Submit">Submit</button> 
      </form>
      <p>{result}</p>
    </div>
  );
}

export default SearchBar;
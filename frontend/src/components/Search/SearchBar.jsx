import React from 'react';
import axios from 'axios';

function SearchBar() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState([]); 

  function handleChange(event) {
    console.log(`INFO handleChange(): event.target.value: ${event.target.value}`);
    setInput(event.target.value);
  }

  async function handleSubmit(event) {
    console.log(`INFO handleSubmit()`);
    event.preventDefault(); // prevent the default refresh behavior of the event from the <form> element
    // console.log(`INFO query after change: ${query}`);
    console.log("INFO handleSearch()"); 

    // Send the input query to the backend for database access 
    try {
      console.log(`INFO try sending query ${input} to the backend`); 
      const res = await axios.get('http://localhost:4000/v1/search/subject/' + input); 

      console.log(`INFO response:`);
      console.log(res); 
      console.log(`INFO response.data:`);
      console.log(res.data); 
      console.log(`INFO response.data.subjects:`);
      console.log(res.data.subjects); 

      setResult(res.data.subjects); 
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  }

  return (
    <div>
      <h1>Search for subject</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="Enter your subject"
          value={input}
        /> 
        <button type="Submit">Submit</button> 
      </form>
      <p>{result.length !== 0 && JSON.stringify(result)}</p>
    </div>
  );
}

export default SearchBar;
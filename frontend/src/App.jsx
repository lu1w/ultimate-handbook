import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Import components */
import PlannerPage from './pages/PlannerPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div>
      <Routes>
        {/* NOTE: the home path '/' can be the loading page, or the page where we ask user questions about their enrollment */}
        <Route path="/" element="" />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;

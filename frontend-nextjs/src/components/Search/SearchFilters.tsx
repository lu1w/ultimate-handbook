import React from 'react';

import FilterHeader from '@/components/search/filterHeader';
import Filter from '@/components/search/filter';

interface SearchFiltersProps {
  className?: string | undefined;
  allStudyAreas: Array<string>;
  handleLevel: (text: string) => void;
  handleTerms: (text: string) => void;
  handleStudyArea: (text: string) => void;
}

function SearchFilters({
  className,
  allStudyAreas,
  handleLevel,
  handleTerms,
  handleStudyArea,
}: SearchFiltersProps) {
  return (
    <div className={'bg-gray-100 px-4 rounded-lg' + className}>
      <FilterHeader header="Levels" />
      <Filter text="Level 1" handleCheck={handleLevel} />
      <Filter text="Level 2" handleCheck={handleLevel} />
      <Filter text="Level 3" handleCheck={handleLevel} />

      <FilterHeader header="Semester/Term" />
      <Filter text="Summer Term" handleCheck={handleTerms} />
      <Filter text="Semester 1" handleCheck={handleTerms} />
      <Filter text="Winter Term" handleCheck={handleTerms} />
      <Filter text="Semester 2" handleCheck={handleTerms} />

      <FilterHeader header="Study Area" />
      {/* <Filter text="BIOL" handleCheck={handleStudyArea} />
      <Filter text="CHEM" handleCheck={handleStudyArea} />
      <Filter text="COMP" handleCheck={handleStudyArea} />
      <Filter text="MAST" handleCheck={handleStudyArea} /> */}
      {allStudyAreas.map((area, index) => (
        <Filter key={index} text={area} handleCheck={handleStudyArea} />
      ))}
    </div>
  );
}

export default SearchFilters;

import React from 'react';

import FilterHeader from '@/components/search/filterHeader';
import Filter from '@/components/search/filter';
import { Level, StudyPeriod } from '@/lib/constants';

interface SearchFiltersProps {
  className?: string | undefined;
  allStudyAreas: Set<string>;
  handleLevel: (
    event: React.ChangeEvent<HTMLInputElement>,
    level: Level,
  ) => void;
  handleStudyPeriod: (
    event: React.ChangeEvent<HTMLInputElement>,
    studyPeriod: StudyPeriod,
  ) => void;
  handleStudyArea: (
    event: React.ChangeEvent<HTMLInputElement>,
    area: string,
  ) => void;
}

export default function SearchFilters({
  className,
  allStudyAreas,
  handleLevel,
  handleStudyPeriod,
  handleStudyArea,
}: SearchFiltersProps) {
  return (
    <div className={`bg-gray-100 px-4 rounded-xl ${className}`}>
      <FilterHeader header="Level" />
      <Filter text="Level 1" handleCheck={(e) => handleLevel(e, 1)} />
      <Filter text="Level 2" handleCheck={(e) => handleLevel(e, 2)} />
      <Filter text="Level 3" handleCheck={(e) => handleLevel(e, 3)} />

      <FilterHeader header="Study Period" />
      <Filter
        text="Summer Term"
        handleCheck={(e) => handleStudyPeriod(e, 'Summer_Term')}
      />
      <Filter
        text="Semester 1"
        handleCheck={(e) => handleStudyPeriod(e, 'Semester_1')}
      />
      <Filter
        text="Winter Term"
        handleCheck={(e) => handleStudyPeriod(e, 'Winter_Term')}
      />
      <Filter
        text="Semester 2"
        handleCheck={(e) => handleStudyPeriod(e, 'Semester_2')}
      />

      <FilterHeader header="Study Area" />
      {/* <Filter text="BIOL" handleCheck={handleStudyArea} />
      <Filter text="CHEM" handleCheck={handleStudyArea} />
      <Filter text="COMP" handleCheck={handleStudyArea} />
      <Filter text="MAST" handleCheck={handleStudyArea} /> */}
      {Array.from(allStudyAreas)
        .toSorted()
        .map((area) => (
          <Filter
            key={area}
            text={area}
            handleCheck={(e) => handleStudyArea(e, area)}
          />
        ))}
    </div>
  );
}

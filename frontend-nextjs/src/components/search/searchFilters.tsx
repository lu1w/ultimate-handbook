import { useState } from 'react';

import FilterHeader from '@/components/search/filterHeader';
import Filter from '@/components/search/filter';
import { Level, StudyPeriod } from '@/lib/constants';

interface SearchFiltersProps {
  className?: string | undefined;
  allStudyAreas: Array<string>;
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
  clearLevels: () => void;
  clearStudyPeriods: () => void;
  clearStudyAreas: () => void;
}

export default function SearchFilters({
  className,
  allStudyAreas,
  handleLevel,
  handleStudyPeriod,
  handleStudyArea,
  clearLevels,
  clearStudyPeriods,
  clearStudyAreas,
}: SearchFiltersProps) {
  const allLevels = Object.values(Level);
  const allStudyPeriods = Object.values(StudyPeriod);

  const [allLevelsChecked, setAllLevelsChecked] = useState<boolean | null>(
    true,
  );
  const [allStudyPeriodsChecked, setAllStudyPeriodsChecked] = useState<
    boolean | null
  >(true);
  const [allStudyAreasChecked, setAllStudyAreasChecked] = useState<
    boolean | null
  >(true);

  return (
    <div className={`bg-gray-100 px-4 rounded-xl ${className}`}>
      <FilterHeader
        header="Level"
        clearAll={function () {
          clearLevels();
          setAllLevelsChecked(false);
        }}
      />
      {allLevels.map((level) => (
        <Filter
          key={level}
          text={`Level ${level}`}
          handleCheck={function (e) {
            setAllLevelsChecked(null);
            handleLevel(e, level);
          }}
          checked={allLevelsChecked}
        />
      ))}
      {/* <Filter text="Level 1" handleCheck={(e) => handleLevel(e, 1)} />
      <Filter text="Level 2" handleCheck={(e) => handleLevel(e, 2)} />
      <Filter text="Level 3" handleCheck={(e) => handleLevel(e, 3)} /> */}

      <FilterHeader
        header="Study Period"
        clearAll={function () {
          clearStudyPeriods();
          setAllStudyPeriodsChecked(false);
        }}
      />
      {allStudyPeriods.map((studyPeriod) => (
        <Filter
          key={studyPeriod}
          text={studyPeriod}
          handleCheck={function (e) {
            setAllStudyPeriodsChecked(null);
            handleStudyPeriod(e, studyPeriod);
          }}
          checked={allStudyPeriodsChecked}
        />
      ))}
      {/* <Filter
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
      /> */}

      <FilterHeader
        header="Study Area"
        clearAll={function () {
          clearStudyAreas();
          setAllStudyAreasChecked(false);
        }}
      />
      {allStudyAreas.map((area) => (
        <Filter
          key={area}
          text={area}
          handleCheck={function (e) {
            setAllStudyAreasChecked(null);
            handleStudyArea(e, area);
          }}
          checked={allStudyAreasChecked}
        />
      ))}
    </div>
  );
}

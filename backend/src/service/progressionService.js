// const progressionStats = {
//     overall1: 0,
//     overall2: 0,
//     overall3: 0,
//     discipline1: 0,
//     discipline2: 0,
//     discipline3: 0,
//     breadth1: 0,
//     breadth2: 0,
//     breadth3: 0
//   };

// const MAX_CREDIT_POINT = 1000; // to indicate there are no credit point ceiling for the rule

const levels = ['1', '2', '3'];
const ALL_STUDY_PERIODS = [
  'y1su',
  'y1s1',
  'y1wi',
  'y1s2',
  'y2su',
  'y2s1',
  'y2wi',
  'y2s2',
  'y3su',
  'y3s1',
  'y3wi',
  'y3s2'
];

const progressionDescription = [].concat(
  levels.map((lv) => `of Level ${lv} Subject`),
  levels.map((lv) => `of Level ${lv} Discipline Subject`),
  levels.map((lv) => `of Level ${lv} Breadth Subject`)
);

/** Display of credit point in the frontend */
function progressionDisplay(range) {
  // no minimum
  if (range[0] === 0) {
    return `${range[1]}(max) Credit Points`; // display   12.5 / 50(max) Credit Points
  }

  // no maximum
  if (range[1] >= 300) {
    return `${range[0]}(min) Credit Points`; // display   12.5 / 50(min) Credit Points
  }

  return `${range[0]}(min) & ${range[1]}(max) Credit Points`; // display   12.5 / 50(min) & 75.5(max) Credit Points
}

/* Get all the subjects available in the planner */
function getAllSubjectsByLevel(planner) {
  const subjects = {
    level1: [],
    level2: [],
    level3: [],
    level4: []
  };

  Object.keys(planner).forEach((studyPeriod) => {
    Object.keys(planner[studyPeriod]).forEach((slot) => {
      if (Object.keys(planner[studyPeriod][slot]).length !== 0) {
        subjects[
          `level${planner[studyPeriod][slot]['subjectCode'].charAt(4)}`
        ].push(planner[studyPeriod][slot]);
      }
    });
  });
  return subjects;
}

function scienceProgressions(courseInfo, planner, progressionStats) {
  /* This is the current progression of the user.
   * When it returns, the object will look something like this:
   *
   * progressions = {
   *   general: {
   *     compulsory: { stats: 'Compulsory Subject: SCIE10005', fulfilled: true },
   *     breadth: {
   *       stats: '0 / 50(min) to 62.5(max) Credit Points of Breadth Subject',
   *       fulfilled: false
   *     },
   *   },
   *   levelsRules: {
   *     overall: {
   *       level1: {
   *         stats: '12.5 / 125(max) Credit Points of Level 1 Subjects'
   *         fulfilled: true
   *       },
   *     },
   *     discipline: {
   *       level1: {
   *         stats: '12.5 / 62.5(min) Credit Points of Level 1 Discipline Subjects'
   *         fulfilled: false
   *       },
   *       level2: {
   *         stats: '25 / 62.5(min) Credit Points of Level 2 Discipline Subjects'
   *         fulfilled: false
   *       },
   *       level3: {
   *         stats: '0 / 75(min) Credit Points of Level 3 Discipline Subjects'
   *         fulfilled: false
   *       },
   *     },
   *     breadth: {
   *       total: {
   *         stats: '0 / 50(min) to 62.5(max) Credit Points of Breadth Subjects'
   *         fulfilled: false
   *       }
   *       level1: {
   *         stats: '0 / 25(max) Credit Points of Level 1 Breadth Subjects'
   *         fulfilled: true
   *       },
   *     },
   *     degreeProgression: {
   *       level1: {
   *         stats: '12.5 / 50 Credit Points of Level 1 subjects before studying Level 2 subjects'
   *         fulfilled: false
   *       },
   *       level2: {
   *         stats: '12.5 / 50 Credit Points of Level 2 subjects before studying Level 3 subjects'
   *         fulfilled: false
   *       },
   *     },
   *     distinctStudyArea: {
   *       level1: {
   *         stats: 'No more than 37.5 Credit Points of Level 1 subjects from the same study area: MAST'
   *         fulfilled: false
   *       }
   *     }
   *   }
   * }
   */
  const progressions = {
    general: {},
    levelsRules: {
      overall: {},
      discipline: {},
      breadth: {},
      degreeProgression: {},
      distinctStudyArea: {}
    }
  };

  /** Fill in the progression status for the number of credit points for
   * each level of overall, discipline, and breadth subject
   */
  [
    'overall1',
    'overall2',
    'overall3',
    'discipline1',
    'discipline2',
    'discipline3',
    'breadth1',
    'breadth2',
    'breadth3'
  ].forEach((field, index) => {
    if (courseInfo[field]) {
      const [min, max] = courseInfo[field];
      const progressionType = field.slice(0, -1); // e.g. 'overall'
      const lv = field.charAt(field.length - 1); // e.g. '1'
      console.log(
        `INFO data: min=${min}, max=${max}, progressionType=${progressionType}, lv=${lv}`
      );

      Object.assign(progressions.levelsRules[progressionType], {
        [`level${lv}`]: {
          stats: `${progressionStats[field]} / ${progressionDisplay(courseInfo[field])} ${progressionDescription[index]}`,
          fulfilled:
            min <= progressionStats[field] && progressionStats[field] <= max
        }
      });
    }
  });

  /* Fill in the level progression rule, e.g. certain amount of level1 need to be studies before level2 */
  ['progression1', 'progression2'].forEach((field) => {
    const lv = parseInt(field.charAt(field.length - 1)); // e.g. '1'
    const floor = courseInfo[field]; // the minimum number of level x subject before studying level x+1 subject

    let creditOfCurrentLevel = 0;

    let fulfilled = true;
    let checked = false;

    /* Iterate over each study period (i.e. semester/term) */
    for (let studyPeriod of ALL_STUDY_PERIODS) {
      // const studyPeriod = ALL_STUDY_PERIODS[i];

      /* Ignore the invalid study periods */
      if (!planner[studyPeriod]) {
        continue;
      }

      let creditOfCurrentLevelInTerm = 0;

      /* Iterate over each position in the study period */
      for (let position in planner[studyPeriod]) {
        if (Object.keys(planner[studyPeriod][position]).length !== 0) {
          const subjectLevel = planner[studyPeriod][position].level;

          if (subjectLevel === lv + 1) {
            /* If the subject is of the next level, check if the prerquisites are met */
            fulfilled = creditOfCurrentLevel >= floor;
            checked = true;
            break;
          } else if (subjectLevel === lv) {
            /* If the subject is of the current level, update the number of credit points */
            creditOfCurrentLevelInTerm += planner[studyPeriod][position].points;
          }
        }
      }

      /* If the progression rule is checked, then break */
      if (checked) break;

      /* If not checked, update the total credit point of subjects from the current level */
      creditOfCurrentLevel += creditOfCurrentLevelInTerm;
    }

    progressions.levelsRules.degreeProgression[`level${lv}`] = {
      stats: `${creditOfCurrentLevel} / ${floor}(min) Credit Points of Level ${lv} subjects before taking Level ${lv + 1} subject`,
      fulfilled: fulfilled
    };
  });

  /* Fill in the constrains on the number of credit point within each distrinct study area */
  const subjectsByLevel = getAllSubjectsByLevel(planner);

  ['distinctStudyArea1'].forEach((field) => {
    const lv = field.charAt(field.length - 1); // e.g. '1'
    const subjectsOfLevel = subjectsByLevel[`level${lv}`];
    const ceiling = courseInfo[field];

    /* Sum up the number of credit point of this level to check if it exceed the ceiling */
    const creditPointsOfStudyArea = {};
    subjectsOfLevel.forEach((subject) => {
      creditPointsOfStudyArea[subject.subjectCode.slice(0, 4)]
        ? (creditPointsOfStudyArea[subject.subjectCode.slice(0, 4)] +=
            subject.points)
        : (creditPointsOfStudyArea[subject.subjectCode.slice(0, 4)] =
            subject.points);
    });

    const maxCreditPoint = Math.max(...Object.values(creditPointsOfStudyArea));

    progressions.levelsRules.distinctStudyArea[`level${lv}`] = {
      stats: `${maxCreditPoint} / ${ceiling}(max) Credit Points of each distinct study area of Level ${lv} subjects`,
      fulfilled: maxCreditPoint <= ceiling
    };
  });

  return progressions;
}

module.exports = {
  scienceProgressions
};

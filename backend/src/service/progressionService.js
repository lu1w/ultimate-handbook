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

const levels = ['1', '2', '3'];

const progressionDescription = [].concat(
  levels.map((lv) => `of Level ${lv} Subject`),
  levels.map((lv) => `of Level ${lv} Discipline Subject`),
  levels.map((lv) => `of Level ${lv} Breadth Subject`)
);

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

function scienceProgressions(courseInfo, progressionStats) {
  /* This is the current progression of the user.
   * When it returns, the object will look something like this:
   *
   * currentProgression = {
   *   overall: {
   *     level1: {
   *       stats: '12.5 / 125(max) Credit Points of Level 1 Subjects'
   *       fulfilled: true
   *     },
   *   },
   *   discipline: {
   *     level1: {
   *       stats: '12.5 / 62.5(min) Credit Points of Level 1 Discipline Subjects'
   *       fulfilled: false
   *     },
   *     level2: {
   *       stats: '25 / 62.5(min) Credit Points of Level 2 Discipline Subjects'
   *       fulfilled: false
   *     },
   *     level3: {
   *       stats: '0 / 75(min) Credit Points of Level 3 Discipline Subjects'
   *       fulfilled: false
   *     },
   *   },
   *   breadth: {
   *     total: {
   *       stats: '0 / 50(min) to 62.5(max) Credit Points of Breadth Subjects'
   *       fulfilled: false
   *     }
   *     level1: {
   *       stats: '0 / 25(max) Credit Points of Level 1 Breadth Subjects'
   *       fulfilled: true
   *     },
   *   },
   *   degreeProgression: {
   *     level1: {
   *       stats: '12.5 / 50 Credit Points of Level 1 subjects before studying Level 2 subjects'
   *       fulfilled: false
   *     },
   *     level2: {
   *       stats: '12.5 / 50 Credit Points of Level 2 subjects before studying Level 3 subjects'
   *       fulfilled: false
   *     },
   *   },
   *   distinctStudyArea: {
   *     level1: {
   *       stats: 'No more than 37.5 Credit Points of Level 1 subjects from the same study area: MAST'
   *       fulfilled: false
   *     }
   *   }
   *
   * }
   */
  const progressions = {
    overall: {},
    discipline: {},
    breadth: {},
    degreeProgression: {}
  };

  /* Fill in the data for constraints on the number of credit points for each level */
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
    // e.g. field = 'overall1'
    console.log(`INFO fill in data for field: ${field}`);
    if (courseInfo[field]) {
      console.log(
        `INFO data exists for field: ${field} is ${courseInfo[field]}`
      );
      const [min, max] = courseInfo[field];
      const progressionType = field.slice(0, -1); // e.g. 'overall'
      const lv = field.charAt(field.length - 1); // e.g. '1'
      console.log(
        `INFO data: min=${min}, max=${max}, progressionType=${progressionType}, lv=${lv}`
      );

      Object.assign(progressions[progressionType], {
        [`level${lv}`]: {
          stats: `${progressionStats[field]} / ${progressionDisplay(courseInfo[field])} ${progressionDescription[index]}`,
          fulfilled:
            min <= progressionStats[field] && progressionStats[field] <= max
        }
      });
    }
  });

  /* TODO: Fill in the degree progression rule */
  ['progression1', 'progression2'].forEach(() => {});

  return progressions;
}

module.exports = {
  scienceProgressions
};

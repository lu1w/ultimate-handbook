// const progression = {
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
const progressionDisplay = (range) => {
  if (range[0] === 0) {
    // no minimum
    return `${range[1]}(max) Credit Points`; // display   12.5 / 50(max) Credit Points
  }
  if (range[1] === -1) {
    // no maximum
    return `${range[0]}(min) Credit Points`; // display   12.5 / 50(min) Credit Points
  }
  return `${range[0]}(min) & ${range[1]}(max) Credit Points`; // display   12.5 / 50(min) & 75.5(max) Credit Points
};

const levels = ['1', '2', '3'];

const progressionContext = [].concat(
  levels.map((lv) => `of Level ${lv} Subject`),
  levels.map((lv) => `of Level ${lv} Discipline Subject`),
  levels.map((lv) => `of Level ${lv} Breadth Subject`)
);

const progressionField = levels.map((lv) => `level${lv}`);

const isProgressionFulfilled = (min, max, curr) =>
  min <= curr && (curr <= max || max === -1);

const scienceProgression = (courseInfo, progression) => {
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
   *   progression: {
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
  const currentProgression = {
    overall: {},
    discipline: {},
    breadth: {},
    progression: {}
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
    if (courseInfo[field]) {
      const [min, max] = courseInfo.field;
      Object.assign(currentProgression.overall, {
        [progressionField[index]]: {
          stats: `${progression[field]} / ${progressionDisplay(courseInfo[field])} ${progressionContext[index]}`,
          fulfilled: isProgressionFulfilled(min, max, progression[field])
        }
      });
    }
  });

  // [
  //   (courseInfo.overall1,
  //   courseInfo.overall2,
  //   courseInfo.overall3,
  //   courseInfo.discipline1,
  //   courseInfo.discipline2,
  //   courseInfo.discipline3,
  //   courseInfo.breadth1,
  //   courseInfo.breadth2,
  //   courseInfo.breadth3)
  // ].forEach((requirement, index) => {
  //   if (requirement) {
  //     const [min, max] = requirement;
  //     Object.assign(currentProgression.overall, {
  //       [progressionField[index]]: {
  //         stats: `${progression.overall1} / ${progressionDisplay(courseInfo.overall1)} ${progressionContext[index]}`,
  //         fulfilled: isProgressionFulfilled(min, max, progression.overall1)
  //       }
  //     });
  //   }
  // });

  return currentProgression;
};

module.exports = {
  scienceProgression
};

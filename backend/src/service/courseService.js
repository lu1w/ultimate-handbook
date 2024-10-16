const mongoClient = require('../config/mongoClient');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const { COURSE_COLLECTION, MAJOR_COLLECTION } = require('../lib/dbConstants');
const { scienceProgression } = require('./progressionService');

const axios = require('axios');
const PRESMALLER = -1;
const semesterOrder = {
  s1: 1,
  s2: 2,
  su: 3,
  wi: 4
};
const planner = {
  y1s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y1s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y2s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y2s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y3s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y3s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  }
  // y4s1: {
  //   p1: {},
  //   p2: {},
  //   p3: {},
  //   p4: {}
  // }
};

const userInfo = {
  degree: '',
  major: ''
};
const compulsory = [];
const majorCore = [];

const progression = {
  overall1: 0,
  overall2: 0,
  overall3: 0,
  discipline1: 0,
  discipline2: 0,
  discipline3: 0,
  breadth1: 0,
  breadth2: 0,
  breadth3: 0
};

const setInitialInfo = async (req, res, next) => {
  const userId = uuidv4(); // 生成唯一的 userId
  console.log('enter setInitInfo');
  const { degree, major } = req.query;
  console.log(`get degree and major, degree = ${degree}, major = ${major}`);

  /* Set degree info */
  if (degree) {
    userInfo.degree = degree;

    try {
      const degreeCollection =
        await mongoClient.getCollection(COURSE_COLLECTION);
      const degreeInfo = await degreeCollection.findOne({
        courseName: degree
      });
      if (!degreeInfo) {
        return next(new ApiError(404, 'Degree not found.'));
      }
      const { compulsorySubject } = degreeInfo;
      compulsory.length = 0;
      compulsory.push(...compulsorySubject);
    } catch (err) {
      return next(new ApiError(500, `Server error ${err}`));
    }
  }

  /* Set major info */
  if (major) {
    userInfo.major = major;

    try {
      // Fetch core subjects based on the major
      const majorCollection = await mongoClient.getCollection(MAJOR_COLLECTION);
      const majorInfo = await majorCollection.findOne({
        majorName: major
      });
      if (!majorInfo) {
        return next(new ApiError(404, 'Major not found.'));
      }
      const { coreSubjects } = majorInfo;
      majorCore.length = 0;
      majorCore.push(...coreSubjects);
    } catch (err) {
      return next(new ApiError(500, `Server error ${err}`));
    }
  }

  res.status(200).send({
    message: `User Info Successfully Initialized: degree = ${degree}, major = ${major}`,
    compulsory,
    majorCore,
    userId
  });
};

const getInitialInfo = async (req, res, next) => {
  try {
    res.json({
      message: 'Core subjects and compulsory courses retrieved successfully',
      userInfo,
      coreSubjects: majorCore,
      compulsorySubject: compulsory
    });
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const getPlanner = (req, res) => {
  res.send(planner);
};

const addTerm = (req, res) => {
  const { term } = req.body; // e.g., term = 'y1su' or 'y1wi'
  if (!term) {
    return res.status(400).json({ message: 'No term provided.' });
  }
  if (planner[term]) {
    return res.status(400).json({ message: 'Term already exists in planner.' });
  }
  // Define positions based on term type
  let positions = {};
  if (term.endsWith('su') || term.endsWith('wi')) {
    positions = { p1: {}, p2: {} };
  } else {
    positions = { p1: {}, p2: {}, p3: {}, p4: {} };
  }
  planner[term] = positions;
  res.status(200).json({ message: 'Term added successfully.', planner });
};

const addSubject = async (req, res, next) => {
  try {
    const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }
    if (!subjectData || Object.keys(subjectData).length === 0) {
      return res.status(400).json({ message: 'No Subjects data provided.' });
    }
    const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
    const subject = subjectData[slot]; // get the Subject object
    const term = slot.substring(0, 4); // 'y1s2'
    const position = slot.substring(4, 6); // 'p1'

    // Check if the slot exists
    if (!planner[term] || !planner[term][position]) {
      return res.status(400).json({ message: 'Invalid time or position.' });
    }
    // check if the Subjects already exists
    if (Object.keys(planner[term][position]).length !== 0) {
      console.debug(
        'Subject already exists in this slot' + planner[term][position]
      );
      return res.status(400).json({
        message:
          'can not add Subjects to this slot!,because subject already exist'
      });
    }

    const { subjectCode } = subject;
    if (!subjectCode) {
      return res.status(400).json({ message: 'lack of the subject code' });
    }
    planner[term][position] = subject;
    console.log(
      `my planner after adding subject ${subjectCode}: ${JSON.stringify(planner)}`
    );
    next();
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const isValidAdd = async (req, res, next) => {
  const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }
  if (!subjectData || Object.keys(subjectData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
  const subject = subjectData[slot]; // get the Subject object
  const subjectSemesterInPlanner = slot.substring(3, 4); // '2'
  const subjectsCodeInPlanner = getAllSubjectCodes(planner);

  checkAllSubjectPrequisites(subjectsCodeInPlanner); // we will check all subjects prerequisites in planner after adding the subject

  // check if the Subjects is in the right semester
  const { studyPeriod } = subject;
  // Check if studyPeriod array contains any items
  if (studyPeriod && studyPeriod.length > 0) {
    // Loop through each study period to check against the subjectSemesterInPlanner
    const match = studyPeriod.some((period) => {
      const studyRequireSemester = period.substring(9); // Extract subjectSemesterInPlanner number
      return studyRequireSemester === subjectSemesterInPlanner;
    });
    if (!match) {
      subject.semesterError = true;
    } else {
      delete subject.semesterError;
    }
  }
  next();
};

const giveTypeOfSubject = async (req, res, next) => {
  const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }
  if (!subjectData || Object.keys(subjectData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
  const subject = subjectData[slot]; // get the Subject object
  const { subjectCode } = subject;

  if (compulsory.includes(subjectCode)) {
    subject.header = 'COMPULSORY';
  } else if (majorCore.includes(subjectCode)) {
    subject.header = 'MAJOR CORE';
  } else {
    // get the first 4 characters of the Subjects code
    const studyAreaCode = subjectCode.substring(0, 4).toUpperCase();
    try {
      const collection = await mongoClient.getCollection('StudyAreaToCourse');
      const studyAreaDoc = await collection.findOne({});

      if (studyAreaDoc && studyAreaDoc[studyAreaCode]) {
        const degreeName = studyAreaDoc[studyAreaCode]; // get the degree name for the prefix(e.g. MAST)
        // check if the Subjects is discipline or breadth

        if (degreeName === userInfo.degree) {
          subject.header = 'DISCIPLINE';
        } else {
          subject.header = 'BREADTH';
        }
      } else {
        subject.header = 'BREADTH';
      }
      res.status(200).send(planner);
    } catch (err) {
      console.error('error:', err);
      return next(new ApiError(500, 'server error'));
    }
  }
};

const removeSubject = (req, res, next) => {
  console.log(`Enter removeSubject()`);
  try {
    const { slot } = req.params;
    if (!slot) {
      return next(new ApiError(400, 'No Subject data provided.'));
    }

    const studyPeriod = slot.substring(0, 4); // 'y1s2'
    const position = slot.substring(4, 6); // 'p1'

    // check if Subject exists
    if (
      !planner[studyPeriod] ||
      !planner[studyPeriod][position] ||
      Object.keys(planner[studyPeriod][position]).length === 0
    ) {
      return res.status(404).json({ message: 'No Subjects found!' });
    }

    // delete planner[semesterKey][position];
    // Reset the slot to an empty object
    planner[studyPeriod][position] = {};

    // get all codes of subjects in the planner (after removing the subject)
    const subjectsCodeInPlanner = getAllSubjectCodes(planner);

    checkAllSubjectPrequisites(subjectsCodeInPlanner);

    res.status(200).send(planner);
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const resolveMiddleware = async (req, res, next) => {
  try {
    const response = await axios.post('http://localhost:5001/resolve', {
      courseName: userInfo.degree,
      coursePlanner: planner
    });

    Object.assign(planner, response.data);

    console.log('Updated planner:', planner);
    next();
  } catch (error) {
    if (error.response) {
      next(new ApiError(error.response.status, error.response.data));
    } else {
      next(new ApiError(500, 'Error communicating with Python API'));
    }
  }
};
const checkOutComeAfterResolve = async (req, res, next) => {
  try {
    const subjectsCodeInPlanner = getAllSubjectCodes(planner);
    checkAllSubjectPrequisites(subjectsCodeInPlanner);
    res.status(200).send(planner); // but we should make a loop if errors exist!
  } catch (error) {
    if (error.response) {
      next(new ApiError(error.response.status, error.response.data));
    } else {
      next(new ApiError(500, 'Error communicating with Python API'));
    }
  }
};

// V1: this function will decide whether need to add error to the subject
// function checkAllSubjectPrequisites(subjectsCodeInPlanner) {
//   // loop all subjects in the planner
//   for (const semester in planner) {
//     for (const pos in planner[semester]) {
//       const subj = planner[semester][pos];
//       const { prerequisites } = subj;
//       if (prerequisites && prerequisites.length > 0) {
//         const prerequisitesMet = arePrerequisitesMet(
//           prerequisites,
//           subjectsCodeInPlanner
//         ); // check all subjects prerequisites in planner
//         if (!prerequisitesMet) {
//           // mark the subject with error
//           subj.prerequisiteError = true;
//         } else {
//           delete subj.prerequisiteError;
//         }
//       }
//     }
//   }
// }
// V2: Updated function to decide whether need to add error to the subject
// this function will decide whether need to add error to the subject
function checkAllSubjectPrequisites(subjectsCodeInPlanner) {
  // Loop all subjects in the planner
  for (const semester in planner) {
    for (const pos in planner[semester]) {
      const subj = planner[semester][pos];
      const { prerequisites } = subj;
      if (prerequisites && prerequisites.length > 0) {
        const prerequisitesMet = arePrerequisitesMet(
          prerequisites, // [[a,b], [c,d]]
          subjectsCodeInPlanner, // { COMP10002: 'y1s1', COMP20003: 'y1s2' }
          semester // 'y1s2'
        );
        if (!prerequisitesMet) {
          // Mark the subject with error
          subj.prerequisiteError = true;
        } else {
          delete subj.prerequisiteError;
        }
      }
    }
  }
}

// V1: get all codes of subjects in the planner
// function getAllSubjectCodes(planner) {
//   const subjectCodesArray = [];
//   for (const semester in planner) {
//     for (const position in planner[semester]) {
//       const subject = planner[semester][position];
//       if (subject && subject.subjectCode) {
//         subjectCodesArray.push(subject.subjectCode);
//       }
//     }
//   }
//   return subjectCodesArray;
// }
// V2: Function to get subject semesters
function getAllSubjectCodes(planner) {
  const subjectSemesters = {}; // Mapping from subject code to semester
  for (const semester in planner) {
    for (const position in planner[semester]) {
      const subject = planner[semester][position];
      if (subject && subject.subjectCode) {
        subjectSemesters[subject.subjectCode] = semester;
        console.log('Subject semesters:', subjectSemesters);
      }
    }
  }
  return subjectSemesters;
}

// V1:
// function arePrerequisitesMet(prerequisites, subjectsCodeInPlanner) {
//   // prerequisites are an array of arrays
//   // subjectsCodeInPlanner is an array of subject codes
//   console.log('Here is all prerequisite of subjects', prerequisites);

//   for (const andGroup of prerequisites) {
//     // andGroup is an array of subject codes which need to be all satisfied
//     let groupSatisfied = false;
//     for (const subjectCode of andGroup) {
//       if (subjectsCodeInPlanner.includes(subjectCode)) {
//         groupSatisfied = true;
//         break;
//       }
//     }
//     if (!groupSatisfied) {
//       // if any group is not satisfied, return false
//       return false;
//     }
//   }
//   console.log('Here is all subjects in planner now', subjectsCodeInPlanner);
//   return true;
// }
// Updated function to check if prerequisites are met
// V2:
function arePrerequisitesMet(prerequisites, subjectSemesters, currentSemester) {
  // Prerequisites are an array of arrays (OR of ANDs)
  // subjectSemesters is an object mapping subject codes to semesters
  // currentSemester is the semester of the subject being added
  console.log('Here are all prerequisites of the subject:', prerequisites);

  for (const andGroup of prerequisites) {
    // andGroup is an array of subject codes which need to be all satisfied
    let groupSatisfied = false;
    for (const subjectCode of andGroup) {
      if (Object.prototype.hasOwnProperty.call(subjectSemesters, subjectCode)) {
        const prereqSemester = subjectSemesters[subjectCode];
        const comparison = compareSemesters(prereqSemester, currentSemester);
        if (comparison !== PRESMALLER) {
          // Prerequisite is not scheduled before current semester
          groupSatisfied = false;
          continue; // continue to find next prerequisite in one array
        } else if (comparison === PRESMALLER) {
          groupSatisfied = true;
          break;
        }
      } else {
        // Prerequisite subject is not even exist
        groupSatisfied = false;
        break;
      }
    }
    if (!groupSatisfied) {
      // At least one group is satisfied
      console.log("Current subject's prerequisites are met.");
      return false;
    }
  }
  // None of the groups are satisfied
  return true;
}

// Function to compare semesters
function compareSemesters(semesterA, semesterB) {
  // Returns -1 if semesterA is earlier than semesterB
  // Returns 0 if semesterA is the same as semesterB
  // Returns 1 if semesterA is later than semesterB

  const yearA = parseInt(semesterA.substring(1, 2)); // e.g., 'y1s1' -> '1'
  const semAKey = semesterA.substring(2, 4); // 's1', 's2', 'su', 'wi'
  const semAOrder = semesterOrder[semAKey];

  const yearB = parseInt(semesterB.substring(1, 2));
  const semBKey = semesterB.substring(2);
  const semBOrder = semesterOrder[semBKey];

  if (yearA < yearB) {
    return -1;
  } else if (yearA > yearB) {
    return 1;
  } else {
    // Same year, compare semesters
    if (semAOrder < semBOrder) {
      return -1;
    } else if (semAOrder > semBOrder) {
      return 1;
    } else {
      return 0;
    }
  }
}

const getProgression = async (req, res) => {
  try {
    const courseCollection = await mongoClient.getCollection(COURSE_COLLECTION);
    const course = await courseCollection.findOne({
      courseName: userInfo.degree
    });

    let progressionStats = {};
    switch (userInfo.degree) {
      case 'Science':
        progressionStats = scienceProgression(course, progression);
        break;
      case 'Commerce':
        break;
      default: // TODO: this default case should be removed since `userInfo.degree` should be one of the above cases
        progressionStats = scienceProgression(course, progression);
    }
    res.status(200).send(progressionStats);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  setInitialInfo,
  getInitialInfo,
  getPlanner,
  addSubject,
  addTerm,
  isValidAdd,
  giveTypeOfSubject,
  removeSubject,
  getProgression,
  resolveMiddleware,
  checkOutComeAfterResolve
};

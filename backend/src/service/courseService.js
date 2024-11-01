const mongoClient = require('../config/mongoClient');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const {
  COURSE_COLLECTION,
  MAJOR_COLLECTION,
  STUDY_AREA_COLLECTION,
  PLANNER_COLLECTION,
  SUBJECT_COLLECTION
} = require('../lib/dbConstants');
const { scienceProgressions } = require('./progressionService');

const axios = require('axios');

const PRESMALLER = -1;
const semesterOrder = {
  s1: 1,
  s2: 2,
  su: 3,
  wi: 4
};

// const plannersCache = {}; // storeds { userId: planner object }

const setBasicInfo = async (req, res, next) => {
  const { degree, major, userId } = req.query;
  console.log(
    `get degree and major, degree = ${degree}, major = ${major}, userId (self-defined): ${userId}`
  );

  // create user planner object
  const userPlanner = {
    userId: userId ? userId : uuidv4(),
    degree: degree,
    major: major,
    compulsory: [],
    majorCore: [],
    planner: {
      y1s1: { p1: {}, p2: {}, p3: {}, p4: {} },
      y1s2: { p1: {}, p2: {}, p3: {}, p4: {} },
      y2s1: { p1: {}, p2: {}, p3: {}, p4: {} },
      y2s2: { p1: {}, p2: {}, p3: {}, p4: {} },
      y3s1: { p1: {}, p2: {}, p3: {}, p4: {} },
      y3s2: { p1: {}, p2: {}, p3: {}, p4: {} }
    },
    progressionStats: {
      overall1: 0,
      overall2: 0,
      overall3: 0,
      discipline1: 0,
      discipline2: 0,
      discipline3: 0,
      breadth1: 0,
      breadth2: 0,
      breadth3: 0
    }
  };

  /* Set degree info */
  if (degree) {
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
      userPlanner.compulsory.length = 0;
      userPlanner.compulsory.push(...compulsorySubject);
    } catch (err) {
      return next(new ApiError(500, `Server error ${err}`));
    }
  }

  /* Set major info */
  if (major) {
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
      userPlanner.majorCore.length = 0;
      userPlanner.majorCore.push(...coreSubjects);
    } catch (err) {
      return next(new ApiError(500, `Server error ${err}`));
    }
  }

  try {
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);

    if (userId) {
      /* Running a test */
      await plannerCollection.deleteMany({ userId: userId });
    } else {
      /* Check if the userId is already in use, if so, get a new userId */
      let duplicateId;
      for (let i = 0; i < 5; i++) {
        duplicateId = (
          await plannerCollection.find({ userId: userPlanner.userId })
        ).toArray();
        if (duplicateId.length === 0) {
          break;
        }
        userPlanner.userId = uuidv4();
      }
    }

    await plannerCollection.insertOne(userPlanner); // insert user planner data to database

    res.status(200).send({
      degree,
      major,
      userId: userPlanner.userId,
      compulsory: userPlanner.compulsory,
      majorCore: userPlanner.majorCore
    });
  } catch (err) {
    return next(new ApiError(500, `Server error ${err}`));
  }
};

const getBasicInfo = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);
    const userPlanner = await plannerCollection.findOne({ userId: userId });
    const { degree, major, compulsory, majorCore } = userPlanner;

    res.json({
      degree,
      major,
      compulsory,
      majorCore
    });
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const getPlanner = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'No userId provided.' });
  }

  try {
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);
    const userPlanner = await plannerCollection.findOne({ userId: userId });

    if (!userPlanner) {
      return res.status(404).json({ message: 'Planner not found.' });
    }

    res.status(200).json({
      message: 'Planner retrieved successfully',
      planner: userPlanner.planner,
      compulsory: userPlanner.compulsory,
      majorCore: userPlanner.majorCore,
      degree: userPlanner.degree,
      major: userPlanner.major
    });
  } catch (err) {
    return next(new ApiError(500, 'Server error'));
  }
};

const addTerm = async (req, res) => {
  const { term, userId } = req.params; // e.g., term = 'y1su' or 'y1wi'
  const plannerCollection = await mongoClient.getCollection(PLANNER_COLLECTION);
  const userPlanner = await plannerCollection.findOne({ userId: userId });
  const planner = userPlanner.planner;

  if (!userPlanner) {
    return res.status(404).json({ message: 'Planner not found.' });
  }

  if (!term) {
    return res.status(400).send({ message: 'No term provided.' });
  }
  if (planner[term]) {
    return res.status(400).send({ message: 'Term already exists in planner.' });
  }
  // Define positions based on term type
  let positions = {};
  if (term.endsWith('su') || term.endsWith('wi')) {
    positions = { p1: {}, p2: {} };
  } else {
    positions = { p1: {}, p2: {}, p3: {}, p4: {} };
  }
  planner[term] = positions;

  /* Update the database */
  await plannerCollection.updateOne(
    { userId: userId },
    { $set: { planner: planner } }
  );

  res.status(200).send({ message: 'Term added successfully.', planner });
};

const removeTerm = async (req, res) => {
  const { term, userId } = req.params; // e.g., term = 'y1su' or 'y1wi'

  const plannerCollection = await mongoClient.getCollection(PLANNER_COLLECTION);
  const userPlanner = await plannerCollection.findOne({ userId: userId });
  if (!userPlanner) {
    return res.status(404).json({ message: 'Planner not found.' });
  }

  const planner = userPlanner.planner;
  const progressionStats = userPlanner.progressionStats;

  if (planner[term].p1) {
    updateProgressions(progressionStats, planner[term].p1, -1);
  }
  if (planner[term].p2) {
    updateProgressions(progressionStats, planner[term].p2, -1);
  }
  delete planner[term];
  console.log(`------- my planner after removal of term: ---- \n${planner}`);

  /* Update the database */
  await plannerCollection.updateOne(
    { userId: userId },
    { $set: { planner: planner, progressionStats: progressionStats } }
  );

  res.status(200).send({ planner });
};

const loadUserPlanner = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'No userId provided.' });
  }

  try {
    const plannerCollection =
    await mongoClient.getCollection(PLANNER_COLLECTION);
    const userPlanner = await plannerCollection.findOne({ userId: userId });

    console.log(
      `loadUserPlanner() userPlanner: ${JSON.stringify(userPlanner)}`
    );

    if (!userPlanner) {
      return res.status(404).json({ message: 'Planner not found.' });
    }
    req.userId = userId;
    // put planner and userInfo into the request object
    req.userPlanner = userPlanner;

    next();
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const addSubject = async (req, res, next) => {
  try {
    const planner = req.userPlanner.planner;
    const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }

    if (!subjectData) {
      return res
        .status(400)
        .json({ error: 'No subject info for adding new subject' });
    }

    const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
    const term = slot.substring(0, 4); // 'y1s2'
    const position = slot.substring(4, 6); // 'p1'

    const subject = subjectData[slot]; // get the Subject object

    // Check if the slot exists
    if (!planner[term] || !planner[term][position]) {
      return res.status(400).json({ error: 'Invalid time or position' });
    }

    // check if the Subjects already exists
    if (Object.keys(planner[term][position]).length !== 0) {
      return res.status(400).json({
        message: `Subject already exist in the slot: ${term}${position}}`,
        existingSubject: JSON.stringify(planner[term][position])
      });
    }

    const { subjectCode } = subject;
    if (!subjectCode) {
      return res.status(400).json({ error: 'Missing subject code' });
    }

    /* Add subject to planner */
    planner[term][position] = subject;

    req.userPlanner.planner = planner;
    console.log(
      `\nmy planner after adding subject ${subjectCode}: \n${JSON.stringify(planner)}`
    );

    next();
  } catch (err) {
    return next(new ApiError(500, 'Server error'));
  }
};

const isValidAdd = async (req, res, next) => {
  const planner = req.userPlanner.planner;
  const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }

  if (!subjectData || Object.keys(subjectData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }

  const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
  const subject = subjectData[slot]; // get the Subject object
  const subjectSemesterInPlanner = slot.substring(3, 4); // '2'
  const subjectsCodeInPlanner = getAllSubjectCodes(planner);

  checkAllSubjectPrequisites(subjectsCodeInPlanner, planner); // we will check all subjects prerequisites in planner after adding the subject

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
  const userPlanner = req.userPlanner;
  const subjectData = req.body; // e.g. { "y1s2p1": { Subject } }

  if (!subjectData || Object.keys(subjectData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }

  const slot = Object.keys(subjectData)[0]; // e.g.'y1s2p1'
  const subject = subjectData[slot]; // get the Subject object
  const { subjectCode } = subject;

  if (userPlanner.compulsory.includes(subjectCode)) {
    subject.header = 'COMPULSORY';
  } else if (userPlanner.majorCore.includes(subjectCode)) {
    subject.header = 'MAJOR CORE';
  } else {
    // get the first 4 characters of the Subjects code
    const studyAreaCode = subjectCode.substring(0, 4).toUpperCase();
    try {
      const collection = await mongoClient.getCollection(STUDY_AREA_COLLECTION);
      const studyAreaDoc = await collection.findOne({});

      if (studyAreaDoc && studyAreaDoc[studyAreaCode]) {
        const degreeName = studyAreaDoc[studyAreaCode]; // get the degree name for the prefix(e.g. MAST)
        // check if the Subjects is discipline or breadth

        if (degreeName === userPlanner.degree) {
          subject.header = 'DISCIPLINE';
        } else {
          subject.header = 'BREADTH';
        }
      } else {
        res.status(500).send({
          message: 'Error: subject area not correctly stored in the database'
        });
      }
      //updateProgressions(userPlanner.progressionStats, subject);
    } catch (err) {
      return next(new ApiError(500, 'server error'));
    }
  }
  next();
  next();
};

const savePlanner = async (req, res, next) => {
  const { userId } = req.params;
  const planner = req.userPlanner.planner;
  const progressionStats = req.userPlanner.progressionStats;

  try {
    const plannerCollection =
    await mongoClient.getCollection(PLANNER_COLLECTION);
    await plannerCollection.updateOne(
      { userId: userId },
      { $set: { planner: planner, progressionStats: progressionStats } }
    );

    res.status(200).json({ planner });
  } catch (err) {
    return next(new ApiError(500, 'Server error'));
  }
};

const removeSubject = async (req, res, next) => {
  const { userId, slot } = req.params; // get the userId and slot from the request
  if (!userId || !slot) {
    return res.status(400).json({ message: 'No userId or slot provided.' });
  }

  try {
    // get the planner from the database
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);
    const userPlanner = await plannerCollection.findOne({ userId: userId });
    if (!userPlanner) {
      return res.status(404).json({ message: 'Planner not found.' });
    }

    const planner = userPlanner.planner;

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

    const progressionStats = userPlanner.progressionStats;
    console.log(
      `\n--- progression stats before removing subejct: \n${JSON.stringify(progressionStats)}`
    );
    updateProgressions(progressionStats, planner[studyPeriod][position], -1);

    console.log(
      `\n--- progression stats after removing subejct: \n${JSON.stringify(progressionStats)}`
    );

    // delete planner[semesterKey][position];
    // Reset the slot to an empty object
    planner[studyPeriod][position] = {};

    // get all codes of subjects in the planner (after removing the subject)
    const subjectsCodeInPlanner = getAllSubjectCodes(planner);

    checkAllSubjectPrequisites(subjectsCodeInPlanner, planner);

    await plannerCollection.updateOne(
      { userId: userId },
      { $set: { planner: planner, progressionStats: progressionStats } }
    );

    res.status(200).json({ planner });
  } catch (err) {
    return next(new ApiError(500, 'Server error'));
  }
};

const resolveMiddleware = async (req, res, next) => {
  const planner = req.planner;
  const userInfo = req.userInfo;
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
  const planner = req.planner;
  try {
    const subjectsCodeInPlanner = getAllSubjectCodes(planner);
    checkAllSubjectPrequisites(subjectsCodeInPlanner, planner);
    res.status(200).send(planner); // but we should make a loop if errors exist!
  } catch (error) {
    if (error.response) {
      next(new ApiError(error.response.status, error.response.data));
    } else {
      next(new ApiError(500, 'Error communicating with Python API'));
    }
  }
};


// In your courseService.js file

const autoAssignSubject = async (req, res, next) => {
  try {
    const userPlanner = req.userPlanner;
    const planner = userPlanner.planner;
    const subjectCode = req.params.subjectCode;
    if (!subjectCode) {
      return res.status(400).json({ error: 'No subject code provided' });
    }

    // Get the subject from the database
    const collection = await mongoClient.getCollection(SUBJECT_COLLECTION);
    const subject = await collection.findOne({ subjectCode: subjectCode });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get the study periods when the subject is available (e.g., ['Semester 1', 'Semester 2'])
    const studyPeriods = subject.studyPeriod; // e.g., ['Semester 1', 'Semester 2']

    if (!studyPeriods || studyPeriods.length === 0) {
      return res.status(400).json({ error: 'No available study periods for this subject' });
    }

    // Map study periods to planner keys ('Semester 1' -> 's1', etc.)
    const semesterMap = {
      'Semester 1': 's1',
      'Semester 2': 's2',
      'Summer Term': 'su',
      'Winter Term': 'wi'
    };
    const allSemesters = ['s1', 's2', 'su', 'wi'];
    const availableSemesters = studyPeriods.map(period => semesterMap[period]);

    const invalidSemesters = allSemesters.filter(
      (sem) => !availableSemesters.includes(sem)
    );

    const combinedSemesters = [...allSemesters, ...invalidSemesters];
    // Loop over available semesters and years to find the earliest available slot
    const years = ['y1', 'y2', 'y3'];
    let assigned = false;
    let theTerm = '';
    for (const sem of combinedSemesters) {
      for (const year of years) {
        const term = `${year}${sem}`; // e.g., 'y1s1'
        if (planner[term]) {
          const positions = ['p1', 'p2', 'p3', 'p4'];
          for (const pos of positions) {
            if (!planner[term][pos] || Object.keys(planner[term][pos]).length === 0) {
              // Assign the subject to this slot
              //planner[term][pos] = subject;
              assigned = true;
              theTerm = `${year}${sem}${pos}`;
              break;
            }
          }
        }
        if (assigned) break;
      }
      if (assigned) break;
    }

    if (!assigned) {
      return res.status(400).json({ error: 'No available slot found for this subject' });
    }
    const subjectsWithPosition = {[theTerm]: subject};//e.g {y1s1p1: {subject}}
    try {
      res.status(200).send(subjectsWithPosition);
    } 
    catch (err) {
      return next(new ApiError(500, `Server error: ${err.message}`));
    }
  } 
  catch (err) {
    return next(new ApiError(500, `Server error: ${err.message}`));
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
function checkAllSubjectPrequisites(subjectsCodeInPlanner, planner) {
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

async function getProgressions(userId) {
  const progressions = {};

  console.log(`---ENTER getProgressions(${userId})`);

  try {
    /* Get the user planner stats */
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);
    const userPlanner = await plannerCollection.findOne({ userId: userId });

    /* Find the course info to check progression requirement */
    const courseCollection = await mongoClient.getCollection(COURSE_COLLECTION);
    const course = await courseCollection.findOne({
      courseName: userPlanner.degree ? userPlanner.degree : 'Science' // TODO: change this to only userInfo.degree
    });

    switch (userPlanner.degree) {
      case 'Science':
        Object.assign(
          progressions,
          scienceProgressions(
            course,
            userPlanner.planner,
            userPlanner.progressionStats
          )
        );
        break;
      case 'Commerce':
        break;
      default: // TODO: this default case should be removed since `userInfo.degree` should be one of the above cases
        Object.assign(
          progressions,
          scienceProgressions(course, userPlanner.progressionStats)
        );
    }
  } catch (err) {
    console.log(err);
  }

  return progressions;
}

function updateProgressions(progressionStats, subject, side = 1) {
  /* Update the progression stats */

  const { level, points, header } = subject;
  const diffPoints = side * points;
  progressionStats[`overall${level}`] += diffPoints;
  if (header == 'DISCIPLINE') {
    progressionStats[`discipline${level}`] += diffPoints;
  } else if (header == 'BREADTH') {
    progressionStats[`breadth${level}`] += diffPoints;
  }
}


module.exports = {
  setBasicInfo,
  getBasicInfo,
  getPlanner,
  loadUserPlanner,
  addTerm,
  removeTerm,
  addSubject,
  isValidAdd,
  giveTypeOfSubject,
  savePlanner,
  removeSubject,
  getProgressions,
  resolveMiddleware,
  checkOutComeAfterResolve,
  autoAssignSubject
};

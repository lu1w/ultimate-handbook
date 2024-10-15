const mongoClient = require('../config/mongoClient');
const ApiError = require('../utils/ApiError');
const { COURSE_COLLECTION, MAJOR_COLLECTION } = require('../lib/dbConstants');

const planner = {
  y1su: {
    p1: {},
    p2: {}
  },
  y1s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y1wi: {
    p1: {},
    p2: {}
  },
  y1s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },

  y2su: {
    p1: {},
    p2: {}
  },
  y2s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y2wi: {
    p1: {},
    p2: {}
  },
  y2s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },

  y3su: {
    p1: {},
    p2: {}
  },
  y3s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },
  y3wi: {
    p1: {},
    p2: {}
  },
  y3s2: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  },

  y4su: {
    p1: {},
    p2: {}
  },
  y4s1: {
    p1: {},
    p2: {},
    p3: {},
    p4: {}
  }
};

const userInfo = {
  degree: '',
  major: ''
};
const compulsory = [];
const majorCore = [];

const setInitialInfo = async (req, res, next) => {
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
      majorCore.push(...coreSubjects);
    } catch (err) {
      return next(new ApiError(500, `Server error ${err}`));
    }
  }

  res.status(200).json({ message: `degree = ${degree}; major = ${major}` });
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

const addSubject = async (req, res, next) => {
  try {
    const SubjectsData = req.body; // e.g. { "y1s2p1": { Subject } }
    if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
      return res.status(400).json({ message: 'No Subjects data provided.' });
    }
    const param = Object.keys(SubjectsData)[0]; // e.g.'y1s2p1'
    const Subject = SubjectsData[param]; // get the Subject object
    const time = param.substring(0, 4); // 'y1'
    const position = param.substring(4, 6); // 'p1'

    // Check if the slot exists
    if (!planner[time] || !planner[time][position]) {
      return res.status(400).json({ message: 'Invalid time or position.' });
    }
    // check if the Subjects already exists
    if (Object.keys(planner[time][position]).length !== 0) {
      console.debug(
        'Subject already exists in this slot' + planner[time][position]
      );
      return res.status(400).json({
        message:
          'can not add Subjects to this slot!,because subject already exist'
      });
    }

    const { subjectCode } = Subject;
    if (!subjectCode) {
      return res.status(400).json({ message: 'lack of the subject code' });
    }
    planner[time][position] = Subject;
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
  const SubjectsData = req.body; // e.g. { "y1s2p1": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'y1s2p1'
  const Subject = SubjectsData[param]; // get the Subject object
  const subjectSemesterInPlanner = param.substring(3, 4); // '2'
  const subjectsCodeInPlanner = getAllSubjectCodes(planner);

  checkAllSubjectPrequisites(subjectsCodeInPlanner); // we will check all subjects prerequisites in planner after adding the subject

  // check if the Subjects is in the right semester
  const { studyPeriod } = Subject;
  // Check if studyPeriod array contains any items
  if (studyPeriod && studyPeriod.length > 0) {
    // Loop through each study period to check against the subjectSemesterInPlanner
    const match = studyPeriod.some((period) => {
      const studyRequireSemester = period.substring(9); // Extract subjectSemesterInPlanner number
      return studyRequireSemester === subjectSemesterInPlanner;
    });
    if (!match) {
      Subject.semesterError = true;
    } else {
      delete Subject.semesterError;
    }
  }
  next();
};

const giveTypeOfSubject = async (req, res, next) => {
  const SubjectsData = req.body; // e.g. { "y1s2p1": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'y1s2p1'
  const Subject = SubjectsData[param]; // get the Subject object
  const { subjectCode } = Subject;

  if (compulsory.includes(subjectCode)) {
    Subject.header = 'COMPULSORY';
  } else if (majorCore.includes(subjectCode)) {
    Subject.header = 'MAJOR CORE';
  } else {
    // get the first 4 characters of the Subjects code
    const codePrefix = subjectCode.substring(0, 4).toUpperCase();
    try {
      const collection = await mongoClient.getCollection('StudyAreaToCourse');
      const studyAreaDoc = await collection.findOne({});

      if (studyAreaDoc && studyAreaDoc[codePrefix]) {
        const degreeNameForPrefix = studyAreaDoc[codePrefix]; // get the degree name for the prefix(e.g. MAST)
        // check if the Subjects is discipline or breadth
        const userDegreeName = userInfo.degree;

        if (degreeNameForPrefix === userDegreeName) {
          Subject.header = 'DISCIPLINE';
        } else {
          Subject.header = 'BREADTH';
        }
      } else {
        Subject.header = 'BREADTH';
      }
      res.status(200).send(planner);
    } catch (err) {
      console.error('error:', err);
      return next(new ApiError(500, 'server error'));
    }
  }
};

const removeSubject = (req, res, next) => {
  try {
    const { query } = req.params;
    if (!query) {
      return next(new ApiError(400, 'No Subject data provided.'));
    }

    const semesterKey = query.substring(0, 4); // 'y1s2'
    const position = query.substring(4, 6); // 'p1'

    // check if Subject exists
    if (
      !planner[semesterKey] ||
      !planner[semesterKey][position] ||
      Object.keys(planner[semesterKey][position]).length === 0
    ) {
      return res.status(404).json({ message: 'No Subjects found!' });
    }

    // delete planner[semesterKey][position];
    // Reset the slot to an empty object
    planner[semesterKey][position] = {};

    // get all codes of subjects in the planner (after removing the subject)
    const subjectsCodeInPlanner = getAllSubjectCodes(planner);

    checkAllSubjectPrequisites(subjectsCodeInPlanner);

    res.status(200).send(planner);
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

// this function will decide whether need to add error to the subject
function checkAllSubjectPrequisites(subjectsCodeInPlanner) {
  // loop all subjects in the planner
  for (const semester in planner) {
    for (const pos in planner[semester]) {
      const subj = planner[semester][pos];
      const { prerequisites } = subj;
      if (prerequisites && prerequisites.length > 0) {
        const prerequisitesMet = arePrerequisitesMet(
          prerequisites,
          subjectsCodeInPlanner
        ); // check all subjects prerequisites in planner
        if (!prerequisitesMet) {
          // mark the subject with error
          subj.prerequisteError = true;
        } else {
          delete subj.prerequisteError;
        }
      }
    }
  }
}

// get all codes of subjects in the planner
function getAllSubjectCodes(planner) {
  const subjectCodesArray = [];
  for (const semester in planner) {
    for (const position in planner[semester]) {
      const subject = planner[semester][position];
      if (subject && subject.subjectCode) {
        subjectCodesArray.push(subject.subjectCode);
      }
    }
  }
  return subjectCodesArray;
}

function arePrerequisitesMet(prerequisites, subjectsCodeInPlanner) {
  // prerequisites are an array of arrays
  // subjectsCodeInPlanner is an array of subject codes
  console.log('Here is all prerequisite of subjects', prerequisites);

  for (const andGroup of prerequisites) {
    // andGroup is an array of subject codes which need to be all satisfied
    let groupSatisfied = false;
    for (const subjectCode of andGroup) {
      if (subjectsCodeInPlanner.includes(subjectCode)) {
        groupSatisfied = true;
        break;
      }
    }
    if (!groupSatisfied) {
      // if any group is not satisfied, return false
      return false;
    }
  }
  console.log('Here is all subjects in planner now', subjectsCodeInPlanner);
  return true;
}
module.exports = {
  setInitialInfo,
  getInitialInfo,
  getPlanner,
  addSubject,
  isValidAdd,
  giveTypeOfSubject,
  removeSubject
};

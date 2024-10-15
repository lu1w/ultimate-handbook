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
    majorCore
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

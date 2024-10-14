const mongoClient = require('../config/mongoClient');
const ApiError = require('../utils/ApiError');
const subjectPlanner = {
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

const userDegree = {
  degree: '',
  major: ''
};
const compulsory = [];
const majorCore = [];

const getInitialInformation = async (req, res, next) => {
  try {
    const { majorName, degree } = req.query;
    if (!majorName || !degree) {
      return next(new ApiError(400, 'Both majorName and degree are required.'));
    }
    userDegree.degree = degree;
    userDegree.major = majorName;

    // Fetch core subjects based on the major
    const majorCollection = await mongoClient.getCollection('Major');
    const majorInfo = await majorCollection.findOne({ majorName: majorName });
    if (!majorInfo) {
      return next(new ApiError(404, 'Major not found.'));
    }
    const { coreSubjects } = majorInfo;
    majorCore.push(...coreSubjects);

    // Fetch compulsory courses based on the degree
    const degreeCollection = await mongoClient.getCollection('Course');
    const degreeInfo = await degreeCollection.findOne({ courseName: degree });
    if (!degreeInfo) {
      return next(new ApiError(404, 'Degree not found.'));
    }
    const { compulsorySubject } = degreeInfo;
    compulsory.push(...compulsorySubject);

    res.json({
      message: 'Core subjects and compulsory courses retrieved successfully',
      userDegree,
      coreSubjects: majorCore,
      compulsorySubject: compulsory
    });
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const addSubject = async (req, res, next) => {
  try {
    const SubjectsData = req.body; // e.g. { "y1s21": { Subject } }
    if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
      return res.status(400).json({ message: 'No Subjects data provided.' });
    }
    const param = Object.keys(SubjectsData)[0]; // e.g.'y1s2p1'
    const Subject = SubjectsData[param]; // get the Subject object
    const time = param.substring(0, 4); // 'y1'
    const position = param.substring(4, 6); // 'p1'

    // Check if the slot exists
    if (!subjectPlanner[time] || !subjectPlanner[time][position]) {
      return res.status(400).json({ message: 'Invalid time or position.' });
    }
    // check if the Subjects already exists
    if (Object.keys(subjectPlanner[time][position]).length !== 0) {
      console.debug(
        'Subject already exists in this slot' + subjectPlanner[time][position]
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
    subjectPlanner[time][position] = Subject;
    next();
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

const isValidAdd = async (req, res, next) => {
  const SubjectsData = req.body; // e.g. { "y1s21": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'y1s2p1'
  const Subject = SubjectsData[param]; // get the Subject object
  const subjectSemesterInPlanner = param.substring(3, 4); // '2'
  const subjectsCodeInPlanner = getAllSubjectCodes(subjectPlanner);

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
  const SubjectsData = req.body; // e.g. { "y1s21": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: 'No Subjects data provided.' });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'y1s21'
  const Subject = SubjectsData[param]; // get the Subject object
  const { subjectCode } = Subject;

  if (compulsory.includes(subjectCode)) {
    Subject.type = 'compulsory';
  } else if (majorCore.includes(subjectCode)) {
    Subject.type = 'core';
  } else {
    // get the first 4 characters of the Subjects code
    const codePrefix = subjectCode.substring(0, 4).toUpperCase();
    try {
      const collection = await mongoClient.getCollection('StudyAreaToCourse');
      const studyAreaDoc = await collection.findOne({});

      if (studyAreaDoc && studyAreaDoc[codePrefix]) {
        const degreeNameForPrefix = studyAreaDoc[codePrefix]; // get the degree name for the prefix(e.g. MAST)
        // check if the Subjects is discipline or breadth
        const userDegreeName = userDegree.degree;

        if (degreeNameForPrefix === userDegreeName) {
          Subject.type = 'discipline';
        } else {
          Subject.type = 'breadth';
        }
      } else {
        Subject.type = 'breadth';
      }
      res.status(200).send(subjectPlanner);
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
      !subjectPlanner[semesterKey] ||
      !subjectPlanner[semesterKey][position] ||
      Object.keys(subjectPlanner[semesterKey][position]).length === 0
    ) {
      return res.status(404).json({ message: 'No Subjects found!' });
    }

    // delete subjectPlanner[semesterKey][position];
    // Reset the slot to an empty object
    subjectPlanner[semesterKey][position] = {};

    // get all codes of subjects in the subjectPlanner (after removing the subject)
    const subjectsCodeInPlanner = getAllSubjectCodes(subjectPlanner);

    checkAllSubjectPrequisites(subjectsCodeInPlanner);

    res.status(200).send(subjectPlanner);
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
};

// this function will decide whether need to add error to the subject
function checkAllSubjectPrequisites(subjectsCodeInPlanner) {
  // loop all subjects in the subjectPlanner
  for (const semester in subjectPlanner) {
    for (const pos in subjectPlanner[semester]) {
      const subj = subjectPlanner[semester][pos];
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
// get all codes of subjects in the subjectPlanner
function getAllSubjectCodes(subjectPlanner) {
  const subjectCodesArray = [];
  for (const semester in subjectPlanner) {
    for (const position in subjectPlanner[semester]) {
      const subject = subjectPlanner[semester][position];
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
  addSubject,
  isValidAdd,
  giveTypeOfSubject,
  removeSubject,
  getInitialInformation
};

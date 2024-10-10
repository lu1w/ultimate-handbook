const mongoClient = require("../config/mongoClient");
const ApiError = require("../utils/ApiError");
// 如果 subjectPlanner 是需要在整个应用中共享的数据，我们需要确保它在不同的模块中可访问。
// 可以将 subjectPlanner 导出，以便在其他文件中共享。
const subjectPlanner = {};
const userDegree = {
  degree: "",
  major: ""
};
const compulsory = [];
const majorCore = [];

const getInitialInformation = async (req, res, next) => {
  try {
    const { majorName, degree } = req.query;

    if (!majorName || !degree) {
      return next(new ApiError(400, "Both majorName and degree are required."));
    }

    // store data in locals
    res.locals.userDegree = {
      degree,
      major: majorName
    };
    // Fetch core subjects based on the major
    const majorCollection = await mongoClient.getCollection("Major");
    const majorInfo = await majorCollection.findOne({ majorName: majorName });

    if (!majorInfo) {
      return next(new ApiError(404, "Major not found."));
    }
    const { coreSubjects } = majorInfo;
    res.locals.majorCore = coreSubjects;

    // Fetch compulsory courses based on the degree
    const degreeCollection = await mongoClient.getCollection("Course");
    const degreeInfo = await degreeCollection.findOne({ courseName: degree });
    if (!degreeInfo) {
      return next(new ApiError(404, "Degree not found."));
    }
    const { compulsorySubject } = degreeInfo;
    res.locals.compulsory = compulsorySubject;

    // 调用下一个中间件或路由处理器
    next();
  } catch (err) {
    console.error("Error:", err);
    return next(new ApiError(500, "Server error"));
  }
};

const addSubject = async (req, res, next) => {
  try {
    const SubjectsData = req.body; // e.g. { "2024s21": { Subject } }
    if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
      return res.status(400).json({ message: "No Subjects data provided." });
    }
    const param = Object.keys(SubjectsData)[0]; // e.g.'2024s21'
    const Subject = SubjectsData[param]; // get the Subject object
    const time = param.substring(0, 6); // '2024s2'
    const position = param.substring(6, 8); // 'p1'

    if (!subjectPlanner[time]) {
      subjectPlanner[time] = {};
    }
    // check if the Subjects already exists
    if (subjectPlanner[time][position]) {
      return res.status(400).json({
        message:
          "can not add Subjects to this slot!,because subject already exist"
      });
    }

    const { subjectCode } = Subject;
    if (!subjectCode) {
      return res.status(400).json({ message: "lack of the subject code" });
    }
    subjectPlanner[time][position] = Subject;

    // const subjectsCodeInPlanner = getAllSubjectCodes(subjectPlanner)
    // checkAllSubjectPrequisites(subjectsCodeInPlanner);// we will check all subjects prerequisites in planner after adding the subject

    // // check if the Subjects is in the right semester
    // const {studyPeriod} = Subject;
    // // Check if studyPeriod array contains any items
    // if (studyPeriod && studyPeriod.length > 0) {
    //     // Loop through each study period to check against the subjectSemesterInPlanner
    //     const match = studyPeriod.some(period => {
    //         const studyRequireSemester = period.substring(9); // Extract subjectSemesterInPlanner number
    //         return studyRequireSemester === subjectSemesterInPlanner;
    //     });
    //     if(!match){
    //         Subject.semesterError = "not in right semester position!";
    //     }
    //     else{
    //         delete Subject.semesterError;
    //     }
    // }

    // check if the Subjects is compulsory, core, discipline or breadth
    // if (compulsory.includes(subjectCode)) {
    //   Subject.type = 'compulsory';
    // } else if (majorCore.includes(subjectCode)) {
    //   Subject.type = 'core';
    // } else {
    //   // get the first 4 characters of the Subjects code
    //   const codePrefix = subjectCode.substring(0, 4).toUpperCase();
    //   try {
    //     const collection = await mongoClient.getCollection('StudyAreaToCourse');
    //     const studyAreaDoc = await collection.findOne({});

    //     if (studyAreaDoc && studyAreaDoc[codePrefix]) {
    //       const degreeNameForPrefix = studyAreaDoc[codePrefix]; // get the degree name for the prefix(e.g. MAST)
    //       // check if the Subjects is discipline or breadth
    //       const userDegreeName = userDegree.degree;

    //       if (degreeNameForPrefix === userDegreeName) {
    //         Subject.type = 'discipline';
    //       } else {
    //         Subject.type = 'breadth';
    //       }
    //     } else {
    //       Subject.type = 'breadth';
    //     }
    //   } catch (err) {
    //     console.error("error:", err);
    //     return next(new ApiError(500, "server error"));
    //   }
    // }
    next();
  } catch (err) {
    console.error("Error:", err);
    return next(new ApiError(500, "Server error"));
  }
};

const isValidAdd = async (req, res, next) => {
  const SubjectsData = req.body; // e.g. { "2024s21": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: "No Subjects data provided." });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'2024s21'
  const Subject = SubjectsData[param]; // get the Subject object
  const subjectSemesterInPlanner = param.substring(5, 6); // '2'
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
      Subject.semesterError = "not in right semester position!";
    } else {
      delete Subject.semesterError;
    }
  }
  next();
};

const giveTypeOfSubject = async (req, res, next) => {
  const SubjectsData = req.body; // e.g. { "2024s21": { Subject } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: "No Subjects data provided." });
  }
  const param = Object.keys(SubjectsData)[0]; // e.g.'2024s21'
  const Subject = SubjectsData[param]; // get the Subject object
  const { subjectCode } = Subject;

  if (compulsory.includes(subjectCode)) {
    Subject.type = "compulsory";
  } else if (majorCore.includes(subjectCode)) {
    Subject.type = "core";
  } else {
    // get the first 4 characters of the Subjects code
    const codePrefix = subjectCode.substring(0, 4).toUpperCase();
    try {
      const collection = await mongoClient.getCollection("StudyAreaToCourse");
      const studyAreaDoc = await collection.findOne({});

      if (studyAreaDoc && studyAreaDoc[codePrefix]) {
        const degreeNameForPrefix = studyAreaDoc[codePrefix]; // get the degree name for the prefix(e.g. MAST)
        // check if the Subjects is discipline or breadth
        const userDegreeName = userDegree.degree;

        if (degreeNameForPrefix === userDegreeName) {
          Subject.type = "discipline";
        } else {
          Subject.type = "breadth";
        }
      } else {
        Subject.type = "breadth";
      }
      res.json({
        message: "successfully added Subjects!",
        subjectPlanner: subjectPlanner
      });
    } catch (err) {
      console.error("error:", err);
      return next(new ApiError(500, "server error"));
    }
  }
};
const removeSubject = (req, res, next) => {
  try {
    const { query } = req.params;
    if (!query) {
      return next(new ApiError(400, "No Subject data provided."));
    }

    const semesterKey = query.substring(0, 6); // '2024s2'
    const position = query.substring(6, 8); // 'p1'

    // check if Subject exists
    if (
      !subjectPlanner[semesterKey] ||
      !subjectPlanner[semesterKey][position]
    ) {
      return res.status(404).json({ message: "No Subjects found!" });
    }

    delete subjectPlanner[semesterKey][position];

    // get all codes of subjects in the subjectPlanner (after removing the subject)
    const subjectsCodeInPlanner = getAllSubjectCodes(subjectPlanner);

    checkAllSubjectPrequisites(subjectsCodeInPlanner);

    res.json({
      message: "Successfully removed Subjects!",
      subjectPlanner: subjectPlanner
    });
  } catch (err) {
    console.error("Error:", err);
    return next(new ApiError(500, "Server error"));
  }
};

// 这个函数会决定是否给courseplanner里某一门课加上prerequisteError
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
          subj.prerequisteError = "prequisites not met";
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
  // prerequisites 是一个数组的数组
  // subjectsCodeInPlanner 是已完成的课程代码数组
  console.log("Here is all prerequisite of subjects", prerequisites);

  for (const andGroup of prerequisites) {
    // andGroup 是一个课程代码数组，需要全部满足
    let groupSatisfied = false;
    for (const subjectCode of andGroup) {
      if (subjectsCodeInPlanner.includes(subjectCode)) {
        groupSatisfied = true;
        break;
      }
    }
    if (!groupSatisfied) {
      // 如果有一个组满足，先修条件就满足
      return false;
    }
  }
  console.log("Here is all subjects in planner now", subjectsCodeInPlanner);
  return true;
}
module.exports = {
  addSubject,
  isValidAdd,
  giveTypeOfSubject,
  removeSubject,
  getInitialInformation,
  subjectPlanner,
  userDegree,
  compulsory,
  majorCore
};

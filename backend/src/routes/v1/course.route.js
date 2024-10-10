const express = require("express");
const router = express.Router();
const mongoClient = require("../../config/mongoClient");
const ApiError = require("../../utils/ApiError");
const {
  addSubject,
  removeSubject,
  getInitialInformation,
  isValidAdd,
  giveTypeOfSubject
} = require("../../service/courseService");

// const SubjectsPlanner = {};
// const userDegree = {
//   degree: "",
//   major: ""
// };
// const compulsory = []
// const majorCore = [];

//Example of SubjectsPlanner:
// {
//   "SubjectsPlannerArray": {
//     "2024s1": {
//       "p1": {
//         "SubjectsCode": "COMP10002",
//         "SubjectsName": "COMPUTER!",
//         "more": "..."
//       }
//     },
//     "2024s2": {
//       "p2": {
//         "SubjectsCode": "COMP10002",
//         "SubjectsName": "COMPUTER!",
//         "more": "..."
//       }
//     }
//   }
// }

/**
 * @swagger
 * /course/main:
 *   get:
 *     summary: Get core subjects and compulsory courses
 *     description: Retrieve all core subjects based on the `major` and all compulsory courses based on the `degree`.
 *     parameters:
 *       - name: majorName
 *         in: query
 *         required: true
 *         description: Major name (e.g., ComputerScience)
 *         schema:
 *           type: string
 *       - name: degree
 *         in: query
 *         required: true
 *         description: Degree name (e.g., Bachelor of Science)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved core subjects and compulsory courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coreSubjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 compulsoryCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Missing major or degree parameter
 *       404:
 *         description: Major or degree not found
 *       500:
 *         description: Server error
 */
router.get("/main", getInitialInformation, (req, res) => {
  const { userDegree, compulsory, majorCore } = res.locals;

  res.json({
    message: "Core subjects and compulsory courses retrieved successfully",
    userDegree,
    coreSubjects: majorCore,
    compulsorySubject: compulsory
  });
});

// router.get("/main", async (req, res, next) => {
//   try {
//     const { majorName, degree } = req.query;

//     // Validate that both major and degree are provided
//     if (!majorName || !degree) {
//       return next(new ApiError(400, "Both majorName and degree are required."));
//     }

//     // Store degree and major in userDegree object
//     userDegree.degree = degree;
//     userDegree.major = majorName;

//     // Fetch core subjects based on the major
//     const majorCollection = await mongoClient.getCollection("Major");
//     const majorInfo = await majorCollection.findOne({ majorName: majorName });

//     if (!majorInfo) {
//       return next(new ApiError(404, "Major not found."));
//     }

//     const { coreSubjects } = majorInfo;

//     // Store core subjects in majorCore array
//     majorCore.length = 0; // Clear any existing data
//     majorCore.push(...coreSubjects);

//     // Fetch compulsory courses based on the degree
//     const degreeCollection = await mongoClient.getCollection("Course");
//     const degreeInfo = await degreeCollection.findOne({ courseName: degree });

//     if (!degreeInfo) {
//       return next(new ApiError(404, "Degree not found."));
//     }

//     const { major } = degreeInfo;

//     // Store compulsory courses in compulsory array
//     compulsory.length = 0; // Clear any existing data
//     compulsory.push(...major);

//     // Respond with both core subjects and compulsory courses
//     res.json({
//       message: "Core subjects and compulsory courses retrieved successfully",
//       coreSubjects: majorCore,
//       compulsorySubject: compulsory
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return next(new ApiError(500, "Server error"));
//   }
// });

/**
 * @swagger
 * /course/remove/{query}:
 *   delete:
 *     summary: remove Subject
 *     description: according to the given `query` to remove one Subject from Subjects planner.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: Subject slot position (e.g. 2024s2p1)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: successfully removed Subjects
 *       404:
 *         description: canot find the Subject!
 *       400:
 *         description: inavlid query!
 */
// Remove one Subject from one slot
// router.delete("/remove/:query", async (req, res, next) => {
//   const { query } = req.params;
//   if (!query) {
//     return next(new ApiError(400, "No Subject data provided."));
//   }

//   const semesterKey = query.substring(0, 6); // '2024s2 '
//   const position = query.substring(6, 8); // 'p1'

//   // check if Subject exists
//   if (
//     !SubjectsPlanner[semesterKey] ||
//     !SubjectsPlanner[semesterKey][position]
//   ) {
//     return res.status(404).json({ message: "No Subjects found!" });
//   }

//   delete SubjectsPlanner[semesterKey][position];

//   res.json({
//     message: "Successfully removed Subjects!",
//     SubjectsPlanner: SubjectsPlanner
//   });
// });
router.delete("/remove/:query", removeSubject);

// function arePrerequisitesMet(prerequisites, subjectsCodeInPlanner) {
//   // prerequisites 是一个数组的数组
//   // subjectsCodeInPlanner 是已完成的课程代码数组
//   console.log("Here is all prerequisite of subjects" ,prerequisites);

//   for (const orGroup of prerequisites) {
//     // orGroup 是一个课程代码数组，只需满足其中一门课程
//     let groupSatisfied = true;
//     for (const subjectCode of orGroup) {
//       if (!subjectsCodeInPlanner.includes(subjectCode)) {
//         groupSatisfied = false;
//         break;
//       }
//     }
//     if (groupSatisfied) {
//       // 如果有一个组不满足，先修条件就不满足
//       return true;
//     }
//   }
//   console.log("Here is all subjects in planner now" ,subjectsCodeInPlanner);
//   return false;
// }

// function getAllSubjectCodes(SubjectsPlanner) {
//   const subjectCodesArray = [];
//   for (const semester in SubjectsPlanner) {
//     for (const position in SubjectsPlanner[semester]) {
//       const subject = SubjectsPlanner[semester][position];
//       if (subject && subject.subjectCode) {
//         subjectCodesArray.push(subject.subjectCode);
//       }
//     }
//   }
//   return subjectCodesArray;
// }
/**
 * @swagger
 * /course/add:
 *   post:
 *     summary: add Subjects
 *     description: add one Subject to one of slot in Subjects planner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               "2024s2p1": { "subjectCode": "COMP20003", "subjectName": "Algorithms and Data Structures" }
 *     responses:
 *       200:
 *         description: successfully added Subject
 *       400:
 *         description: failed to add Subject
 */
// Drag one Subjects to one slot
// router.post("/add", async (req, res) => {
//   const SubjectsData = req.body; // e.g. { "2024s21": { Subjects } }
//   if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
//     return res.status(400).json({ message: "No Subjects data provided." });
//   }

//   const param = Object.keys(SubjectsData)[0]; //e.g.'2024s21'
//   const Subjects = SubjectsData[param]; // get the Subjects object

//   const time = param.substring(0, 6); // '2024s2'
//   const position = param.substring(6, 8); // 'p1'

//   // intialize the semester if it doesn't exist
//   if (!SubjectsPlanner[time]) {
//     SubjectsPlanner[time] = {};
//   }

//   // add Subjects to the planner
//   if (SubjectsPlanner[time][position]) {
//     return res
//       .status(400)
//       .json({ message: "can not add Subjects to this slot!,because subject already exist" });
//   }

//   const { subjectCode } = Subjects;
//   if (!subjectCode) {
//     return res.status(400).json({ message: "lack of the subject code" });
//   }

//   // 在添加课程之前，检查先修课程是否满足
//   const subjectsCodeInPlanner = getAllSubjectCodes(SubjectsPlanner);
//   const { prerequisites } = Subjects;
//   console.log("INFO 3 ", prerequisites);
//   if (prerequisites && prerequisites.length > 0) {
//     const prerequisitesMet = arePrerequisitesMet(prerequisites, subjectsCodeInPlanner);
//     console.log("INFO 1 ", prerequisitesMet);
//     if (!prerequisitesMet) {
//       return res.status(400).json({ message: "the prerequisties of this subject is not satisified" });
//     }
//   }
//   console.log("INFO 2", prerequisites);

//   // check if the Subjects is compulsory, core, discipline or breadth
//   if (compulsory.includes(subjectCode)) {
//     Subjects.type = 'compulsory';
//   } else if (majorCore.includes(subjectCode)) {
//     Subjects.type = 'core';
//   } else {
//     // get the first 4 characters of the Subjects code
//     const codePrefix = subjectCode.substring(0, 4).toUpperCase();

//     try {
//       const collection = await mongoClient.getCollection('StudyAreaToCourse');
//       const studyAreaDoc = await collection.findOne({});

//       if (studyAreaDoc && studyAreaDoc[codePrefix]) {
//         const degreeNameForPrefix = studyAreaDoc[codePrefix]; // get the degree name for the prefix(e.g. MAST)
//         // check if the Subjects is discipline or breadth
//         const userDegreeName = userDegree.degree;

//         if (degreeNameForPrefix === userDegreeName) {
//           Subjects.type = 'discipline';
//         } else {
//           Subjects.type = 'breadth';
//         }
//       } else {
//         Subjects.type = 'breadth';
//       }
//     } catch (err) {
//       console.error("error:", err);
//       return next(new ApiError(500, "server error"));
//     }
//   }

//   SubjectsPlanner[time][position] = Subjects;

//   res.json({
//     message: "successfully added Subjects!",
//     SubjectsPlanner: SubjectsPlanner
//   });

// });
router.post("/add", addSubject, isValidAdd, giveTypeOfSubject);

/**
 * @swagger
 * /course/subject/prerequisite/{query}:
 *   get:
 *     summary: get all prerequisites
 *     description: according to the given `query` to get all prerequisites of the Subjects.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: Subjects code (e.g. COMP10002)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: successfully return all prerequisites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: ["COMP20002"]
 *       404:
 *         description: cannot find the Subjects!
 *       500:
 *         description: server error!
 */
// Get all prerequisites for a given Subjects
router.get("/subject/prerequisite/:query", async (req, res, next) => {
  const { query } = req.params;
  if (query) {
    try {
      const collection = await mongoClient.getCollection("Subject");
      const Subjects = await collection.findOne({ subjectCode: query });
      if (!Subjects) {
        return next(new ApiError(404, "Subjects not found."));
      }
      return res.json(Subjects.prerequisites);
    } catch (err) {
      return next(new ApiError(500, "Server error"));
    }
  } else {
    return next(new ApiError(400, "Search query is required"));
  }
});

/**
 * @swagger
 * /course/majorCompulsory:
 *   get:
 *     summary: Get all core subjects for a given major
 *     description: Retrieve all core subjects and their prerequisites for a given `major`.
 *     parameters:
 *       - name: major
 *         in: query
 *         required: true
 *         description: Major name (e.g. ComputerScience)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully returned all core subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Core subjects retrieved successfully"
 *                 coreSubjects:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example: [
 *                     ["2", "ANAT30007", "ANAT30008"],
 *                     ["1", "BIOM30003"],
 *                     ["1", "CEDB30003"]
 *                   ]
 *       400:
 *         description: No major provided!
 *       404:
 *         description: Cannot find core subjects for the given major!
 *       500:
 *         description: Server error!
 */

// Get all complusory Subjects for a given Subject
router.get("/majorCompulsory", async (req, res, next) => {
  try {
    const major = req.query.major;

    if (!major) {
      return next(new ApiError(400, "Major is required."));
    }

    const collection = await mongoClient.getCollection("Major");
    const majorInfo = await collection.findOne({ majorName: major });

    if (!majorInfo) {
      return next(new ApiError(404, "Major not found."));
    }

    const { coreSubjects } = majorInfo;

    res.json({
      message: "Core subjects retrieved successfully",
      coreSubjects: coreSubjects
    });
  } catch (err) {
    return next(new ApiError(500, "Server error"));
  }
});

module.exports = router;

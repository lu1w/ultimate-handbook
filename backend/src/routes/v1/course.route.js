const express = require("express");
const router = express.Router();
const mongoClient = require("../../config/mongoClient");
const ApiError = require("../../utils/ApiError");
const SubjectsPlanner = {};
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
 * /:
 *   get:
 *     summary: Welcome message
 *     description: return a welcome message
 *     responses:
 *       200:
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to the U handbook!!!."
 */
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the U handbook!!!."
  });
});

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
router.delete("/remove/:query", async (req, res, next) => {
  const { query } = req.params;
  if (!query) {
    return next(new ApiError(400, "No Subject data provided."));
  }

  const semesterKey = query.substring(0, 6); // '2024s2 '
  const position = query.substring(6, 8); // 'p1'

  // check if Subject exists
  if (
    !SubjectsPlanner[semesterKey] ||
    !SubjectsPlanner[semesterKey][position]
  ) {
    return res.status(404).json({ message: "No Subjects found!" });
  }

  delete SubjectsPlanner[semesterKey][position];

  res.json({
    message: "Successfully removed Subjects!",
    SubjectsPlanner: SubjectsPlanner
  });
});

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
 *               "2024s21": { "SubjectsCode": "COMP10002", "SubjectsName": "COMPUTER!" }
 *     responses:
 *       200:
 *         description: successfully added Subject
 *       400:
 *         description: failed to add Subject
 */
// Drag one Subjects to one slot
router.post("/add", async (req, res) => {
  const SubjectsData = req.body; // e.g. { "2024s21": { Subjects } }
  if (!SubjectsData || Object.keys(SubjectsData).length === 0) {
    return res.status(400).json({ message: "No Subjects data provided." });
  }

  const param = Object.keys(SubjectsData)[0]; //e.g.'2024s21'
  const Subjects = SubjectsData[param]; // get the Subjects object

  const time = param.substring(0, 6); // '2024s2'
  const position = param.substring(6, 8); // 'p1'

  // intialize the semester if it doesn't exist
  if (!SubjectsPlanner[time]) {
    SubjectsPlanner[time] = {};
  }

  // add Subjects to the planner
  if (SubjectsPlanner[time][position]) {
    return res
      .status(400)
      .json({ message: "can not add Subjects to this slot!" });
  }
  SubjectsPlanner[time][position] = Subjects;

  res.json({
    message: "successfully added Subjects!",
    SubjectsPlanner: SubjectsPlanner
  });
});

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
  console.log("INFO enter GET /Subjects/prerequisite/");
  const { query } = req.params;
  console.log(`INFO query is ${query}`);

  if (query) {
    try {
      const collection = await mongoClient.getCollection("Subject");
      const Subjects = await collection.findOne({ subjectCode: query });
      if (!Subjects) {
        return next(new ApiError(404, "Subjects not found."));
      }
      return res.json(Subjects.prerequisites);
    } catch (err) {
      console.error("Error:", err);
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
    console.error("Error:", err);
    return next(new ApiError(500, "Server error"));
  }
});

module.exports = router;

module.exports = router;

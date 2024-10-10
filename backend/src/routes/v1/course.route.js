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
router.get("/main", getInitialInformation);

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

router.delete("/remove/:query", removeSubject);

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

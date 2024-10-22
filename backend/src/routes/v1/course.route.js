const express = require('express');
const router = express.Router();
const mongoClient = require('../../config/mongoClient');
const ApiError = require('../../utils/ApiError');
const {
  setInitialInfo,
  getInitialInfo,
  getPlanner,
  addTerm,
  removeTerm,
  addSubject,
  removeSubject,
  isValidAdd,
  giveTypeOfSubject,
  getProgressions,
  resolveMiddleware,
  checkOutComeAfterResolve,
  loadUserPlanner,
  savePlanner,
  checkOutComeAfterResolve
} = require('../../service/courseService');

/**
 * @swagger
 * /course/main:
 *   get:
 *     summary: Get core subjects and compulsory courses
 *     description: Retrieve all core subjects based on the `majorName` and all compulsory courses based on the `degree`.
 *     responses:
 *       200:
 *         description: Successfully retrieved core subjects and compulsory courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userDegree:
 *                   type: object
 *                   properties:
 *                     degree:
 *                       type: string
 *                     major:
 *                       type: string
 *                 coreSubjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 compulsorySubject:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Both major and degree are required.
 *       404:
 *         description: Major or degree not found.
 *       500:
 *         description: Server error.
 */
router.get('/main', getInitialInfo);

/**
 * @swagger
 * /course/main:
 *   post:
 *     summary: Set user degree and major, and initialize user planner information.
 *     parameters:
 *       - name: degree
 *         in: query
 *         required: true
 *         description: Degree name (e.g., Science). This sets the compulsory subjects for the degree.
 *         schema:
 *           type: string
 *       - name: major
 *         in: query
 *         required: false
 *         description: Major name (e.g., Data Science). This sets the core subjects for the major.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information successfully initialized, returning userId, compulsory subjects, and core subjects for the degree and major.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Info Successfully Initialized: degree = Science, major = Data Science"
 *                 userId:
 *                   type: string
 *                   example: "5f8d0d55b54764421b7156b7"
 *                 compulsory:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Mathematics", "Physics"]
 *                 majorCore:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Data Structures", "Algorithms"]
 *       404:
 *         description: Degree or Major not found.
 *       500:
 *         description: Server error.
 */

router.post('/main', setInitialInfo);

/**
 * @swagger
 * /course/user/{userId}/planner:
 */
router.get('/user/:userId/planner', getPlanner);

/**
 * @swagger
 * /course/user/{userId}/remove/{slot}:
 *   delete:
 *     summary: Remove a subject from the planner
 *     description: Remove a subject from the planner for a user based on the provided `slot` and `userId`.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose subject is being removed.
 *         schema:
 *           type: string
 *       - name: slot
 *         in: path
 *         required: true
 *         description: Subject slot position (e.g., y1s2p1).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully removed the subject from the planner.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 planner:
 *                   type: object
 *                   description: The updated planner after removing the subject.
 *       400:
 *         description: No userId or slot provided, or invalid slot.
 *       404:
 *         description: No subject found in this slot or planner not found for the given user.
 *       500:
 *         description: Server error.
 */

router.delete('/user/:userId/remove/:slot', removeSubject);

/**
 * @swagger
 * /course/user/{userId}/add:
 *   post:
 *     summary: Add a subject to the planner
 *     description: Add one subject to a slot in the subject planner.
 *     request:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: An object where the key is the slot (e.g., 'y1s2p1') and the value is the subject data.
 *             example:
 *               "y1s2p1": {
 *                 "subjectCode": "COMP20003",
 *                 "subjectName": "Algorithms and Data Structures",
 *                 "level": 2,
 *                 "points": 12.5,
 *                 "location": "On Campus (Parkville)",
 *                 "studyPeriod": ["Semester 2"],
 *                 "prerequisites": [["COMP10002", "COMP20005"]],
 *                 "corequisites": [],
 *                 "nonAllowedSubjects": ["COMP20007", "COMP90038"]
 *               }
 *     responses:
 *       200:
 *         description: Successfully added the subject to the planner.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operation successful."
 *                 planner:
 *                   type: object
 *                   description: The updated planner after adding the subject.
 *       400:
 *         description: No subject data provided, invalid slot, or subject already exists in the slot.
 *       500:
 *         description: Server error.
 */
router.post('/user/:userId/add', loadUserPlanner ,addSubject, isValidAdd, giveTypeOfSubject,savePlanner);

/**
 * @swagger
 * /course/prerequisites/{query}:
 *   get:
 *     summary: Get all prerequisites for a subject
 *     description: Retrieve all prerequisites for the subject specified by `query`.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: Subject code (e.g., COMP10002)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully returned all prerequisites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *               example:
 *                 [
 *                   ["COMP10002", "COMP20005"],
 *                   ["MATH10005"]
 *                 ]
 *       404:
 *         description: Subject not found.
 *       400:
 *         description: Search query is required.
 *       500:
 *         description: Server error.
 */
router.get('/prerequisites/:query', async (req, res, next) => {
  const { query } = req.params;
  if (query) {
    try {
      const collection = await mongoClient.getCollection('Subject');
      const subject = await collection.findOne({ subjectCode: query });
      if (!subject) {
        return next(new ApiError(404, 'Subject not found.'));
      }
      return res.json(subject.prerequisites);
    } catch (err) {
      return next(new ApiError(500, 'Server error'));
    }
  } else {
    return next(new ApiError(400, 'Search query is required'));
  }
}
       


/**
 * @swagger
 * /course/user/{userId}/resolve:
 */
router.post('/user/:userId/resolve',loadUserPlanner ,resolveMiddleware, checkOutComeAfterResolve);

/**
 * @swagger
 * /course/user/{userId}/addTerm/{term}:
 */
router.post('/user/:userId/addTerm/:term', addTerm);

/**
 * @swagger
 * /course/user/{userId}/removeTerm/{term}:
 */
router.post('/user/:userId/removeTerm/:term', removeTerm);


/**
 * @swagger
 * /course/cores/{major}:
 *   get:
 *     summary: Get all core subjects for a given major
 *     description: Retrieve all core subjects for a given `major`.
 *     parameters:
 *       - name: major
 *         in: query
 *         required: true
 *         description: Major name (e.g., Data Science)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully returned all core subjects.
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
 *                     type: string
 *                   example: ["COMP10002", "COMP20003", "COMP20007"]
 *       400:
 *         description: Major is required.
 *       404:
 *         description: Major not found.
 *       500:
 *         description: Server error.
 */
router.get('/cores/:major', async (req, res, next) => {
  try {
    const { major } = req.params;

    if (!major) {
      return next(new ApiError(400, 'Major is required.'));
    }

    const collection = await mongoClient.getCollection('Major');
    const majorInfo = await collection.findOne({ majorName: major });

    if (!majorInfo) {
      return next(new ApiError(404, 'Major not found.'));
    }

    const { coreSubjects } = majorInfo;

    res.json({
      message: 'Core subjects retrieved successfully',
      coreSubjects: coreSubjects
    });
  } catch (err) {
    return next(new ApiError(500, 'Server error'));
  }
});

/**
 * @swagger
 * /course/user/{userId}/progressions:
 *   get:
 *     summary: get all the degree progression statistics
 */
router.get('/user/:userId/progressions', async (req, res) => {
  // try {
  const progressions = await getProgressions();
  res.status(200).send(progressions);
  // } catch (err) {
  //   // TODO: handle error
  // }
});

module.exports = router;

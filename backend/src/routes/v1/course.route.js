const express = require('express');
const router = express.Router();
const mongoClient = require('../../config/mongoClient');
const ApiError = require('../../utils/ApiError');
const coursePlanner = {};
//Example of coursePlanner:
// {
//   "coursePlannerArray": {
//     "2024s1": {
//       "p1": {
//         "subjectCode": "COMP10002",
//         "subjectName": "COMPUTER!",
//         "more": "..."
//       }
//     },
//     "2024s2": {
//       "p2": {
//         "subjectCode": "COMP10002",
//         "subjectName": "COMPUTER!",
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
router.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the U handbook!!!.' 
    });
});

/**
 * @swagger
 * /course/remove/{query}:
 *   delete:
 *     summary: remove course
 *     description: according to the given `query` to remove one course from course planner.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: course code (e.g. 2024s2p1)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: successfully removed subject
 *       404:
 *         description: canot find the subject!
 *       400:
 *         description: inavlid query!
 */
// Remove one subject from one slot
router.delete('/remove/:query', async(req, res, next) => {
  const { query } = req.params;
  if (!query) {
      return next(new ApiError(400, 'No subject data provided.'));
  }

  const semesterKey = query.substring(0, 6); // '2024s2 '
  const position = query.substring(6, 8); // 'p1'

  // check if subject exists
  if (!coursePlanner[semesterKey] || !coursePlanner[semesterKey][position]) {
      return res.status(404).json({ message: 'No subject found!' });
  }

  delete coursePlanner[semesterKey][position];

  res.json({ 
      message: 'Successfully removed subject!',
      coursePlanner: coursePlanner
  });
});

/**
 * @swagger
 * /course/add:
 *   post:
 *     summary: add course
 *     description: add one course to one of slot in course planner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               "2024s21": { "subjectCode": "COMP10002", "subjectName": "COMPUTER!" }
 *     responses:
 *       200:
 *         description: successfully added subject
 *       400:
 *         description: failed to add subject
 */
// Drag one subject to one slot
router.post('/add', async(req, res, next) => {
  const subjectData = req.body; // e.g. { "2024s21": { subject } }
  if (!subjectData || Object.keys(subjectData).length === 0) {
      return res.status(400).json({ message: 'No subject data provided.' });
  }

  const param = Object.keys(subjectData)[0]; //e.g.'2024s21'
  const subject = subjectData[param]; // get the subject object

  const time = param.substring(0, 6); // '2024s2'
  const position = param.substring(6, 8); // 'p1'

  // intialize the semester if it doesn't exist
  if (!coursePlanner[time]) {
      coursePlanner[time] = {};
  }

  // add subject to the planner
  if (coursePlanner[time][position]) {
      return res.status(400).json({ message: 'can not add subject to this slot!' });
  }
  coursePlanner[time][position] = subject;

  res.json({ 
      message: 'successfully added subject!',
      coursePlanner: coursePlanner
  });
});

/**
 * @swagger
 * /course/subject/prerequisite/{query}:
 *   get:
 *     summary: get all prerequisites
 *     description: according to the given `query` to get all prerequisites of the course.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         description: course code (e.g. COMP10002)
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
 *                 example: "COMP20002"
 *       404:
 *         description: cannot find the course!
 *       500:
 *         description: server error!
 */
// Get all prerequisites for a given subject
router.get("/subject/prerequisite/:query", async (req, res,next) => {
    console.log("INFO enter GET /subject/prerequisite/");
    const { query } = req.params;
    console.log(`INFO query is ${query}`);

    if (query) {
        try {
            const collection = await mongoClient.getCollection('Subject');
            const subject = await collection.findOne({ subjectCode: query });
            if (!subject) {
                return next(new ApiError(404, 'Course not found.'));
            }
            return res.json(subject.prerequisites);
        } catch (err) {
            console.error('Error:', err);
            return next(new ApiError(500, 'Server error'));
        }
    } else {
        return next(new ApiError(400, 'Search query is required'));
    }
});

/**
 * @swagger
 * /course/majorCompulsory:
 *   get:
 *     summary: get all core courses for a given major
 *     description: according to the given `major` to get all core courses and prerequisites.
 *     parameters:
 *       - name: major
 *         in: query
 *         required: true
 *         description: major name (e.g. ComputerScience)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: successfully return all core courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Courses selected successfully"
 *                 selectedCourses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [
 *                     "ANAT30007",
 *                     "ANAT30008",
 *                     "BIOM30003",
 *                     "CEDB30003"
 *                   ]
 *       400:
 *         description: not provide major!
 *       404:
 *         description: cannot find core courses for the given major!
 *       500:
 *         description: server error!
 */
// Get all complusory courses for a given subject 
router.get('/majorCompulsory', async (req, res, next) => {
  try {
    const major = req.query.major; 
    
    if (!major) {
      return next(new ApiError(400, 'Major is required.'));
    }

    const collection = await mongoClient.getCollection('Major');
    const majorInfo = await collection.findOne({ majorName: major });
    
    if (!majorInfo) {
      return next(new ApiError(404, 'Major not found.'));
    }

    const { coreSubjects } = majorInfo;

    // create an array to store the selected courses
    let selectedCourses = [];

    // loop every core subject array 
    coreSubjects.forEach((subjectArray) => {
      // index 0 is the number of required courses
      const requiredCourses = subjectArray[0];
      // we get all course can be selected starting from index 1
      const availableCourses = subjectArray.slice(1);

      // we can only select the required number of courses
      const chosenCourses = availableCourses.slice(0, requiredCourses);

      selectedCourses = selectedCourses.concat(chosenCourses);
    });

    res.json({
      message: 'Courses selected successfully',
      selectedCourses: selectedCourses,
    });
  } catch (err) {
    console.error('Error:', err);
    return next(new ApiError(500, 'Server error'));
  }
});

module.exports = router;

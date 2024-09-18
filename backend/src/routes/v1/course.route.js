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


router.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the U handbook!!!.' 
    });
});
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

// Get all prerequisites for a given subject
router.get("/subject/prerequisite/:query", async (req, res) => {
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


// Get all complusory courses for a given subject (THIS IS NOT WORKING NOW ! CUZ I NEED DATA!!)
router.get('/majorCompulsory', async (req, res, next) => {
  const major = req.query.major; // e.g. prerequisites?major=ComputerScience

  if (!major) {
    return next(new ApiError(400, 'Major is required.')); // next will pass api error to next middleware which already defined in app.js
  }

  try {
    //await console.log('major:', major);
    const collectionSubjects = await mongoClient.getCollection('Subjects');

    // // Suppose every subject has a field 'prerequisiteFor' that contains the major it is a prerequisite for

    const majorCourses = collectionSubjects.find(major);// 但这里是找到所有相关major的课程不是找到major必修的课程

    // Get all the prerequisites for the major's core courses
    let corePrerequisitesOfMajor = [];

    majorCourses.forEach(subject => {
      if (subject && subject.prerequisites.length > 0 && subject.isCompulsory) {

          corePrerequisitesOfMajor.push({
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          prerequisites: subject.prerequisites
          
        });
      }
    });
    //就只要找到所有的major要学的课程就好了
    if (majorCoreCourses.length === 0) {
      return next(new ApiError(404, 'No courses found for the given major.'));
    }

    res.json(prerequisites);
  } catch (err) {
    next(new ApiError(500, 'Server error!', true, err.stack));
  }
});    


module.exports = router;

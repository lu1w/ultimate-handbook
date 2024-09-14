const express = require('express');
const router = express.Router();
const mongoClient = require('../../config/mongoClient');
const ApiError = require('../../utils/ApiError');
const coursePlannerArray = {};

// Get all subjects
router.get('/allSubjects', async (req, res) => {
  try {
    const collection = await mongoClient.getCollection('Subjects');
    const subjects = await collection.find({}).toArray();  // Get all subjects
    res.json(subjects);  
  } catch (err) {
    console.error('Error retrieving data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the U handbook!!!.' 
    });
});
// Remove one course from one slot
router.delete('/remove/:query', async(req, res, next) => {
  const { query } = req.params;
  if (!query) {
      return next(new ApiError(400, 'No course data provided.'));
  }

  const semesterKey = query.substring(0, 6); // '2024s2'
  const position = query.substring(6, 8); // 'p1'

  // check if course exists
  if (!coursePlannerArray[semesterKey] || !coursePlannerArray[semesterKey][position]) {
      return res.status(404).json({ message: 'No course found!' });
  }

  delete coursePlannerArray[semesterKey][position];

  res.json({ 
      message: 'Successfully removed course!',
      coursePlannerArray: coursePlannerArray
  });
});
// Drag one course to one slot
router.post('/add', async(req, res, next) => {
  const courseData = req.body; // e.g. { "2024s21": { course } }
  if (!courseData || Object.keys(courseData).length === 0) {
      return res.status(400).json({ message: 'No course data provided.' });
  }

  const param = Object.keys(courseData)[0]; //e.g.'2024s21'
  const course = courseData[param]; // get the course object

  const time = param.substring(0, 6); // '2024s2'
  const position = param.substring(6, 8); // 'p1'

  // intialize the semester if it doesn't exist
  if (!coursePlannerArray[time]) {
      coursePlannerArray[time] = {};
  }

  // add course to the planner
  if (coursePlannerArray[time][position]) {
      return res.status(400).json({ message: 'can not add course to this slot!' });
  }
  coursePlannerArray[time][position] = course;

  res.json({ 
      message: 'successfully added course!',
      coursePlannerArray: coursePlannerArray
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
            const course = await collection.findOne({ subjectCode: query });
            if (!course) {
                return next(new ApiError(404, 'Course not found.'));
            }
            return res.json(course.prerequisites);
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

    // // Suppose every course has a field 'prerequisiteFor' that contains the major it is a prerequisite for

    const majorCourses = collectionSubjects.find(major);// 但这里是找到所有相关major的课程不是找到major必修的课程

    // Get all the prerequisites for the major's core courses
    let corePrerequisitesOfMajor = [];

    majorCourses.forEach(course => {
      if (course && course.prerequisites.length > 0 && course.isCompulsory) {

          corePrerequisitesOfMajor.push({
          subjectName: course.subjectName,
          subjectCode: course.subjectCode,
          prerequisites: course.prerequisites
          
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

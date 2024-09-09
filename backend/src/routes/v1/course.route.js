const express = require('express');
const router = express.Router();
const mongoClient = require('../../config/mongoClient');
const ApiError = require('../../utils/ApiError');
router.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the U handbook!!!.' 
    });
});
// Access the MongoDB collection to get all the courses
router.post('/save-courses', async(req, res, next) => {
    const courseData = req.body; // Get course data from the frontend
    if (!courseData) {
      return res.status(400).json({ message: 'No course data provided.' });
    }
    const coursePlanner = await mongoClient.getCollection("CoursePlanner");
    // Assume the frontend sends a JSON object or array, and we insert it into the database
    await coursePlanner.insertOne(courseData);
    const courseDataArray = await coursePlanner.find({}).toArray();
    res.json({ 
      courseDataArray,
      message: 'Course data saved successfully.' 
    });
});
  

router.get('/subjects', async (req, res) => {
    try {
      const collection = await mongoClient.getCollection('Subjects');
      const subjects = await collection.find({}).toArray();  // Get all subjects
      res.json(subjects);  
    } catch (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


// 新增获取专业先修课程的路由
router.get('/prerequisites', async (req, res, next) => {
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

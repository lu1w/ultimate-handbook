const express = require('express');
const router = express.Router();

const mongoClient = require('../../config/mongoClient');

const { COURSE_COLLECTION } = require('../../lib/dbConstants');

router.use(express.json());

/**
 * @swagger
 * /home/:
 *   get:
 *     summary: Get all course
 *     responses:
 *       200:
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: All the courses that the students can pick from
 *               example: ["Science", "Commerce", "Arts", "..."]
 */
router.get('/', async (req, res) => {
  try {
    const courseCollection = await mongoClient.getCollection(COURSE_COLLECTION);
    const courses = await courseCollection.find({}).toArray();
    const courseNames = courses.map((course) => course.courseName);
    res.status(200).send({ courseNames });
  } catch (err) {
    res.status(500).json({
      error: `Internal server error, failure in retrieve courses from database`
    });
  }
});

/**
 * @swagger
 * /home/majors?{params}/:
 *   get:
 *     summary: Get all majors of a degree
 *     description: Based on the degree, return all majors under the degree
 *     parameters:
 *       - name: degree
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The degree that the user selected.
 *         example: "Science"
 *     responses:
 *       200:
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: The available major within the degree
 *               example: ["Computer Science", "Data Science", "..."]
 */
router.get('/majors', async (req, res) => {
  const degree = req.query.degree;

  try {
    const courseCollection = await mongoClient.getCollection(COURSE_COLLECTION);
    const course = await courseCollection.findOne({ courseName: degree });
    const majors = course.major;
    console.log(`INFO majors = ${majors}`);

    // Send back all study areas
    res.status(200).send({ majors });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Internal server error, failure in retrieve majors from database`
    });
  }
});

module.exports = router;

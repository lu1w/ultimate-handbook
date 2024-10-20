const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();

const mongoClient = require('../../config/mongoClient');

const {
  SUBJECT_COLLECTION,
  STUDY_AREA_COLLECTION
} = require('../../lib/dbConstants');

router.use(express.json());

/**
 * @swagger
 * /search/:
 *   get:
 *     summary: search page
 *     description: search page entry point, display all subjects in the database
 *     responses:
 *       200:
 *         description: successfully fetched all the subjects from the database
 *       500:
 *         description: database failed to provide subject information
 */
router.get('/', async (req, res) => {
  console.log('INFO enter GET search/');

  try {
    console.log('INFO try getting all subjects');
    const collection = await mongoClient.getCollection(SUBJECT_COLLECTION);
    // Query all subjects
    const subjects = await collection.find({}).toArray();

    res.status(200).send({ subjects });
    console.log('INFO finished searching all subjects');
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Database query failed: query all subjects' });
  }
});

/**
 * @swagger
 * /search/conditions?{query}:
 *   get:
 *     summary: Search subjects
 *     description: Retrieve a list of subjects based on subject name or subject code; the query is case-insensitive.
 *     parameters:
 *       - name: input
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The search query string to match against subject names or subject codes.
 *       - name: levels
 *         in: query
 *         required: false
 *         schema:
 *           type: array
 *         description: The array of levels to match against the subject level.
 *       - name: studyPeriods
 *         in: query
 *         required: false
 *         schema:
 *           type: array
 *         description: The study periods to match against any of the subject study period.
 *       - name: studyAreas
 *         in: query
 *         required: false
 *         schema:
 *           type: array
 *         description: The study areas to match against the subject study area.
 *     responses:
 *       200:
 *         description: A list of subjects that matches the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subjectName:
 *                     type: string
 *                     description: The name of the subject
 *                     example: IT Project
 *                   subjectCode:
 *                     type: string
 *                     description: The code of the subject
 *                     example: COMP30022
 *                   level:
 *                     type: int
 *                     description: The level of the subject
 *                     example: 3
 *                   points:
 *                     type: int
 *                     description: The number of credit points the subject counts towards
 *                     example: 12.5
 *                   location:
 *                     type: string
 *                     description: The location of teaching
 *                     example: "On Campus (Parkville)"
 *                   availability:
 *                     type: array
 *                     description: The semester/terms where the subject is available
 *                     example: ["Semester 2"]
 *                   prerequisites:
 *                     type: array
 *                     description: The conjunction of prerequisite requirement of the subject, where each requirement might contain multiple alternatives
 *                     example: [[ "INFO20003" ], [ "INFO30005", "SWEN30006" ]]
 *                     items:
 *                       type: array
 *                       description: The different alternatives of one prerequisite requirement
 *                       example: [ "COMP20003", "COMP20007" ]
 *                       items:
 *                         type: string
 *                         description: The subject code of the prerequisite subject
 *                         example: COMP20007
 *                   corequisites:
 *                     type: array
 *                     description: The subject codes of the corequisite subjects, or empty if none
 *                     example: []
 *                     items:
 *                       type: string
 *                       description: The subject code of the corequisite subject
 *                   nonAllowSubjects:
 *                     type: array
 *                     description: The non-allow subject for this subject, or empty if none
 *                     example: [ "SWEN30007" ]
 *                     items:
 *                       type: string
 *                       description: The subject code of the non-allow subject
 *                       example: SWEN30007
 *
 *       500:
 *         description: Internal server error, possibly due to database issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error, failure in retrieve subjects from database"
 */
router.get('/conditions', async (req, res) => {
  console.log(`INFO ------------------------------------------ `);
  console.log(`INFO req url is: `);
  console.log(req.url);

  const input = req.query.input;
  const levels = req.query.levels
    ? req.query.levels.split(',').map((level) => parseInt(level))
    : [];
  const studyPeriods = req.query.studyPeriods
    ? req.query.studyPeriods
        .split(',')
        .map((studyPeriod) => studyPeriod.split('_').join(' '))
    : [];
  const studyAreas = req.query.studyAreas
    ? req.query.studyAreas.split(',')
    : [];

  console.log(
    `INFO input=${input}, levels=${levels}, studyPeriods=${studyPeriods}, studyAreas=${studyAreas}; 
    studyArea is array: ${Array.isArray(studyAreas)}
    input parse to bool: ${Boolean(input)}`
  );

  const filtersQuery = [
    { level: { $in: levels } },
    { studyPeriod: { $elemMatch: { $in: studyPeriods } } },
    {
      subjectCode: {
        $in: studyAreas.map((codePrefix) => new RegExp('^' + codePrefix))
      }
    }
  ];

  try {
    const collection = await mongoClient.getCollection(SUBJECT_COLLECTION);
    if (input) {
      console.log(`INFO start searching for query ${input}`);

      // Query the database for subjects matching the search query
      const subjects = await collection
        .find({
          $and: [
            {
              $or: [
                { subjectName: new RegExp(input, 'i') }, // Case-insensitive search by name
                { subjectCode: new RegExp(input, 'i') } // Case-insensitive search by code
              ]
            }
          ].concat(filtersQuery)
        })
        .toArray();

      console.log(`INFO done searching for ${input}`);
      res.status(200).send({ subjects }); // Return the matching subjects
    } else {
      const subjects = await collection
        .find({
          $and: filtersQuery
        })
        .toArray();

      console.log(`INFO done searching for ${input}`);
      res.status(200).send({ subjects }); // Return the matching subjects
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Internal server error, failure in retrieve subjects from database`
    });
  }
});

/** API for internal usage */
router.get('/studyareas', async (req, res) => {
  try {
    const collection = await mongoClient.getCollection(STUDY_AREA_COLLECTION);
    const studyAreas = Object.keys(await collection.findOne());

    // Remove the field "_id" from the collection of studay areas
    const index = studyAreas.findIndex((field) => field === '_id');
    if (index !== -1) {
      studyAreas.splice(index, 1);
    }
    console.log(`INFO studyAreas = ${studyAreas}`);

    // Send back all study areas
    res.status(200).send({ studyAreas });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Internal server error, failure in retrieve subjects from database`
    });
  }
});

module.exports = router;

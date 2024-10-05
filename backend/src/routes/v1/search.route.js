const express = require("express");
// const mongoose = require('mongoose');
const router = express.Router();
const mongoClient = require("../../config/mongoClient");

const subjectDB = "Subject"; // TO-DEPLOY: change to "Subject" for production, "Subjects" for testing

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
router.get("/", async (req, res) => {
  console.log("INFO enter GET search/");
  //console.log(req);

  try {
    console.log("INFO try getting all subjects");
    const collection = await mongoClient.getCollection(subjectDB);
    // Query all subjects
    const subjects = await collection.find({}).toArray();

    res.status(200).send({ subjects });
    console.log("INFO finished searching all subjects");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Database query failed: query all subjects" });
  }

  //res.send(req);
});

// router.get("/subject", (req, res) => {
//   console.log("INFO: search query not specified");
//   // TODO: return every
//   res.status(200).send({ subjects: [] });
// });

/**
 * @swagger
 * /search/{query}:
 *   get:
 *     summary: Search subjects
 *     description: Retrieve a list of subjects based on subject name or subject code; the query is case-insensitive.
 *     parameters:
 *       - name: query
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string to match against subject names or subject codes.
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
router.get("/:query", async (req, res) => {
  console.log(`INFO req is: `);
  console.log(req);
  console.log("INFO enter GET search/subject/");
  console.log(`INFO req.query is ${req.query}`);

  const { query } = req.params;
  console.log(`INFO query is ${query}, parse to bool: ${Boolean(query)}`);
  if (query) {
    try {
      console.log(`INFO start searching for query ${query}`);
      const collection = await mongoClient.getCollection(subjectDB);

      // Query the database for subjects matching the search query
      const subjects = await collection
        .find({
          $or: [
            { subjectName: new RegExp(query, "i") }, // Case-insensitive search by name
            { subjectCode: new RegExp(query, "i") } // Case-insensitive search by code
          ]
        })
        .toArray();

      console.log(`INFO done searching for ${query}`);
      res.status(200).send({ subjects }); // Return the matching subjects
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: `Internal server error, failure in retrieve subjects from database`
      });
    }
  }

  //res.send(req);
});

module.exports = router;

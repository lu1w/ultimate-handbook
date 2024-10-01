const express = require("express");
// const mongoose = require('mongoose');
const router = express.Router();
const mongoClient = require("../../config/mongoClient");

const subjectDB = "Subject"; // TO-DEPLOY: change to "Subject" for production, "Subjects" for testing

router.use(express.json());

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
      res.status(500).json({ error: `Database query failed: query ${query}` });
    }
  } else {
    // query is an empty string, do not do anything
    res.json({ error: "Search query is required" });
  }
  //res.send(req);
});

module.exports = router;

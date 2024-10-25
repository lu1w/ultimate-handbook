const express = require('express');
const router = express.Router();
const mongoClient = require('../../config/mongoClient');

const { PLANNER_COLLECTION } = require('../../lib/dbConstants');

// TO-DEPLOY: remove this code before deployment!
router.delete('/all', async (req, res) => {
  let planners = {};

  try {
    console.log(`enter try`);
    const plannerCollection =
      await mongoClient.getCollection(PLANNER_COLLECTION);
    console.log(`getting the planner`);
    plannerCollection.deleteMany({
      $and: [
        { userId: { $not: { $eq: 'yilu' } } },
        { userId: { $not: { $eq: 'testing' } } }
      ]
    });
    planners = await plannerCollection.find({}).toArray();
    console.log(`--- removing`);
  } catch (err) {
    // handle error
  }

  res.status(200).send({ message: 'removed all', plannerCollection: planners });
});

module.exports = router;

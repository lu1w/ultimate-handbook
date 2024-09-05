const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();

const subjectSchema = require('../models/subjectModel'); 
const Subject = mongoose.model('Subject', subjectSchema);

router.use(express.json()); 

router.get("/", async (req, res) => {
    console.log("INFO enter GET search/"); 
    //console.log(req); 

    const { query } = req.query;
    if (query) {
        try {
            console.log("INFO try getting all subjects"); 

            // Query all subjects 
            const subjects = await Subject.find({});
            res.json(subjects); 

            console.log("INFO finished searching all subjects"); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query failed: query all subjects' });
        }
    } else {
        // query is an empty string, do not do anything 
    }
    //res.send(req); 
});

router.get("/subject", async (req, res) => {
    console.log(req); 
    console.log("INFO enter GET search/subject/"); 
    await console.log(`INFO req.query is ${req.query}`); 
    

    const { query } = req.query;
    console.log(`INFO query is ${query}`); 
    if (query) {
        try {
            console.log(`INFO start searching for query ${query}`); 

            // Query the database for subjects matching the search query
            const subjects = await Subject.find({
                $or: [
                    { subjectName: new RegExp(pattern, 'i') }, // Case-insensitive search by name
                    { subjectCode: new RegExp(pattern, 'i') }, // Case-insensitive search by code
                ],
            });

            console.log(`INFO done searching for ${query}`); 
            res.json(subjects); // Return the matching subjects
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: `Database query failed: query ${query}` });
        }
    } else {
        // query is an empty string, do not do anything 
    }
    //res.send(req); 
})

// app.get('/api/subjects', async (req, res) => {
//     const { query } = req.query;

//     if (!query) {
//         return res.status(400).json({ error: 'Search query is required' });
//     }

//     try {
//         // Query the database for subjects matching the search query
//         const subjects = await Subject.find({
//             $or: [
//                 { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
//                 { code: { $regex: query, $options: 'i' } }, // Case-insensitive search by code
//             ],
//         });

//         res.json(subjects); // Return the matching subjects
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Database query failed' });
//     }
// });

module.exports = router; 
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the U handbook!!!.' 
    });
});

router.get('/:faculty', (req, res) => {
    const { faculty} = req.params;

    if (faculty === "Engineering") {
        console.log('faculty:', faculty);
        res.json({ 
            courses: ["Engineering1", "E2", "E3", "E4", "E5"] 
        });
    } else {
        console.log('faculty:', faculty);
        res.status(404).json({ 
            message: 'No courses found for the given faculty.' 
        });
    }
});    

module.exports = router;

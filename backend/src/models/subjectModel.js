const mongoose = require('mongoose'); 

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    }, 
    subjectCode: {
        type: String,
        required: true,
        validator: function(v) { return /^[A-Z]{4}[0-9]{5}$/.test(str); } 
    },
    level: {
        type: String, // TODO: change this to Number in the database 
        required: true
    },
    points: {
        type: String, // TODO: change this to Number in the database 
        required: true
    },
    location: String, 
    subjectUrl: String, 
    prerequisites: [[String]], 
    corequisites: [String], 
    nonAllowedSubjects: [String]
})

module.exports = subjectSchema;
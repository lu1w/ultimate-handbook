const mongoose = require('mongoose');

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    subjectName: {
      type: String,
      required: true
    },
    subjectCode: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    points: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: null
    },
    subjectUrl: {
      type: String,
      required: true
    },
    prerequisites: {
      type: Array,
      default: []
    },
    corequisites: {
      type: Array,
      default: []
    },
    nonAllowedSubjects: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', subjectSchema);

module.exports = Course;

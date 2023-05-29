const Course = require("../models/course.model");

const courseQueries = {
  save: async ({ createObj }) => {
    try {
      const newCourse = new Course(createObj);
      const response = await newCourse.save();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  aggregate: async({aggregateArray})=>{
    try {
      const response = await Course.aggregate(aggregateArray);
      return response;
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
};
module.exports = courseQueries
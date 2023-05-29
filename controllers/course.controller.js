const { default: mongoose } = require("mongoose");
const courseQueries = require("../queries/course.queries");

const createCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await courseQueries.save({ createObj: data });
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status("400").send("Something went wrong creating course");
  }
};

// get course
const getCourse = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const courseAggregateArrray = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: "modules",
          localField: "modules",
          foreignField: "_id",
          as: "modules",
        },
      },
      {
        $unwind: "$modules"
      },
      {
        $lookup: {
          from: "contents",
          localField: "modules.contents",
          foreignField: "_id",
          as: "modules.contents",
        },
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     title: { $first: "$title" },
      //     description: { $first: "$description" },
      //     instructor: { $first: "$instructor" },
      //     duration: { $first: "$duration" },
      //     modules: { $push: "$modules" }
      //   }
      // },
    ];
    const course = await courseQueries.aggregate({
      aggregateArray: courseAggregateArrray,
    });
    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(400).send("Something went wrong fetching course")
  }
};
module.exports = {
  createCourse,
  getCourse,
};

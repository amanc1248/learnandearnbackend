const { default: mongoose } = require("mongoose");
const courseQueries = require("../queries/course.queries");
const { courseData } = require("../data/coursedata");
const Content = require("../models/content.model");
const Module = require("../models/module.model");
const Course = require("../models/course.model");
const { ObjectId } = require("mongodb");

const videoUrls = [
  "https://res.cloudinary.com/proudposhak-com/video/upload/v1685181931/videos/WIN_20230527_15_49_39_Pro_gu2ejj.mp4",
  "https://res.cloudinary.com/proudposhak-com/video/upload/v1660108588/videos/d14790064434206893daa9394855b0e48ba9904ef4fbc8f8bd18bbc41c47cc1d_nbiu8j.mp4",
];
function checkEvenOrOdd(number) {
  if (number % 2 === 0) {
    return "even";
  } else {
    return "odd";
  }
}

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
        $unwind: "$modules",
      },
      {
        $lookup: {
          from: "contents",
          localField: "modules.contents",
          foreignField: "_id",
          as: "modules.contents",
        },
      },
      {
        $sort: {
          "modules.position": 1,
        },
      },
    ];
    const course = await courseQueries.aggregate({
      aggregateArray: courseAggregateArrray,
    });
    res.status(200).send(course);
  } catch (error) {
    console.error(error);
    res.status(400).send("Something went wrong fetching course");
  }
};

// create entire course
const createEntireCourse = async (req, res, next) => {
  try {
    // 1. create all contents for one module.
    for (let indexI = 0; indexI < courseData.length; indexI++) {
      const module = courseData[indexI];
      const { sectionTitle, sectionDescription, duration, position, access } =
        module;
      const moduleObj = {
        title: sectionTitle ? sectionTitle : "Section Title",
        description: sectionDescription
          ? sectionDescription
          : "Section Description",
        duration: duration ? duration : 120,
        position: position ? position : indexI + 1,
        access: indexI < 15 ? "Free" : "Pro",
        contents: [],
      };
      const contentsList = [];
      for (let indexJ = 0; indexJ < module.sectionTopics.length; indexJ++) {
        const content = module.sectionTopics[indexJ];
        const {
          section_topic_title,
          section_topic_description,
          type,
          videoId,
          videoLength,
        } = content;
        const obj = {
          title: section_topic_title ? section_topic_title : "Content title",
          type: type ? type : "video",
          description: section_topic_description
            ? section_topic_description
            : "description",
          duration: videoLength ? videoLength : 120,
          access: indexI < 15 ? "Free" : "Pro",
          videoUrl:
            checkEvenOrOdd(indexJ) === "even" ? videoUrls[0] : videoUrls[1],
          isDeleted: false,
        };
        contentsList.push(obj);
      }

      // 2. save the inserted objects id to the module colleciton.
      const contentSavedResponse = await Content.insertMany(contentsList);
      const convertedResponse = contentSavedResponse.map((content) =>
        content.toObject()
      );

      // 3. save the inserted module id to the course collection.
      const moduleContents = convertedResponse.map((obj) =>
        mongoose.Types.ObjectId(obj._id)
      );
      moduleObj.contents = moduleContents;
      const savingModule = new Module(moduleObj);
      const moduleSavedResponse = await savingModule.save(savingModule);
      const convertedModuleSavedResponse = moduleSavedResponse.toObject();

      // 4. save module id to course
      const modifiedCourse = await Course.updateOne(
        { _id: mongoose.Types.ObjectId("646cd0cdf88e60b04c53dc28") },
        {
          $push: {
            modules: mongoose.Types.ObjectId(convertedModuleSavedResponse._id),
          },
        },
        {
          returnOriginal: false
        }
      );
      console.log(modifiedCourse);
    }
    return res.send("Successfully created");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error)
  }
};
module.exports = {
  createCourse,
  getCourse,
  createEntireCourse,
};

const Content = require("../models/content.model");

const contentQueries = {
  save: async ({ createObj }) => {
    try {
      const newContent = new Content(createObj);
      const response = await newContent.save();
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
module.exports = contentQueries
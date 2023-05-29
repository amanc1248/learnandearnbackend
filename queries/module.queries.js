const Module = require("../models/module.model");

const moduleQueries = {
  save: async ({ createObj }) => {
    try {
      const newModule = new Module(createObj);
      const response = await newModule.save();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
module.exports = moduleQueries
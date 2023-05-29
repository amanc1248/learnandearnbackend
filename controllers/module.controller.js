const moduleQueries = require("../queries/module.queries");

const createModule = async (req, res, next) => {
  try {
    const data = req.body;
    const response = moduleQueries.save({ createObj: data });
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send("Something went wrong creating module");
  }
};

module.exports = {
  createModule,
};

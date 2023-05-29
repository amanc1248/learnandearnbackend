const contentQueries = require("../queries/content.queries");

const createContent = async(req, res, next) => {
  try {
    const data = req.body;
    const response  = await contentQueries.save({createObj: data});
    res.status(200).send(response)
  } catch (error) {
    console.error(error);
    res.status("400").send("Something went wrong creating content");
  }
};
module.exports = {
  createContent,
};

const waitFunction = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {next()}, 4);
  });
};

module.exports = {
    waitFunction,
}
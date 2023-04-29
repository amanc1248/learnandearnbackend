const waitFunction = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {next()}, 6000);
  });
};

module.exports = {
    waitFunction,
}
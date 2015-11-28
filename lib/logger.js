/**
 * Simple logger to return information to the command line
 */
module.exports = function logger() {
  console.log.apply(console, arguments);
};

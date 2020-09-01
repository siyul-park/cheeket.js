module.exports = function required(value) {
  if (value == null) {
    process.exit(1);
  }
  return value;
};

const glob = require('glob');
const lerna = require('./lerna.json');

const projects = lerna.packages
  .map((project) => glob.sync(`${project}/jest.config.js`))
  .reduce((acc, cur) => {
    acc.push(...cur);
    return acc;
  }, [])
  .map((project) => `<rootDir>/${project}`);

module.exports = {
  projects: projects
};

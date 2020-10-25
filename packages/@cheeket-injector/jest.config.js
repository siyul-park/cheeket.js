module.exports = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '\\.spec\\.ts$',
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  globals: {
    'ts-jest': {
      'diagnostics': true
    }
  }
};

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  "collectCoverage": true,
  "collectCoverageFrom": ["**/*.{js,vue}", "!**/node_modules/**"]
}

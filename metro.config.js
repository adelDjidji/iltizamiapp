const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add 'react-native' to export conditions so Firebase and other packages
// resolve their React Native builds instead of Node.js CJS builds.
config.resolver.unstable_conditionNames = [
  "require",
  "default",
  "react-native",
];

module.exports = config;

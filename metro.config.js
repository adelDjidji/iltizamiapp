const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Add 'react-native' to export conditions so Firebase and other packages
// resolve their React Native builds instead of Node.js CJS builds.
config.resolver.unstable_conditionNames = [
  "require",
  "default",
  "react-native",
];

module.exports = config;
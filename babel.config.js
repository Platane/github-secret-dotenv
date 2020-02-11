const getConfig = env => {
  const plugins = ["@babel/plugin-transform-modules-commonjs"];

  const presets = ["@babel/preset-typescript"];

  return { plugins, presets };
};

module.exports = api => {
  api.cache.never();
  return getConfig();
};

module.exports.getConfig = getConfig;

const getConfig = env => {
  const plugins = ["@babel/plugin-transform-modules-commonjs"];

  const presets = ["@babel/preset-typescript"];

  return { plugins, presets };
};

module.exports = api => {
  /**
   * cache the config with this key
   */
  api.cache.invalidate(
    () => `${process.env.NODE_ENV || ""}.${process.env.BABEL_ENV || ""}`
  );

  return getConfig(api.env());
};

module.exports.getConfig = getConfig;

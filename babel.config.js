const getConfig = env => {
  const plugins = [];

  const presets = ["@babel/preset-typescript"];

  if (process.env.NODE_ENV === "test") {
    plugins.push("@babel/plugin-transform-modules-commonjs");
  }

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

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require("webpack-merge");
const CleanPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackMockServer = require("webpack-mock-server");
const dev = require("./webpack.dev");
const assets = require("./webpack.common").assetsPath;

module.exports = (env, argv) => {
  const devConfig = dev(env, argv);
  const { proxy } = env;

  function remove(searchFunction) {
    devConfig.plugins.splice(devConfig.plugins.findIndex(searchFunction), 1);
  }
  // remove plugins because these aren't required for devServer
  remove((a) => a instanceof CleanPlugin.CleanWebpackPlugin);
  remove((a) => a instanceof CopyWebpackPlugin);
  remove((a) => a instanceof MiniCssExtractPlugin);

  /** @type {import('webpack').Configuration} */
  const extendedConfig = {
    target: "web", // force target otherwise HMR doesn't work for style-loader
    /** @type {import('webpack-dev-server').Configuration} */
    devServer: {
      proxy: {
        // requires for ignoring CORS issues
        "/api": { target: proxy, changeOrigin: true, withCredentials: true, secure: false },
      },
      hot: true,
      historyApiFallback: {
        // provide index.html instead of 404:not found error (for SPA app)
        rewrites: [
          { from: /favicon.ico/, to: "public/favicon.ico" }, // provide favicon
        ],
      }, // it enables HTML5 mode: https://developer.mozilla.org/en-US/docs/Web/API/History
      stats: {
        children: false, // disable console.info for node_modules/*
        modules: false,
      },
      before: (app) =>
        // https://github.com/Yegorich555/webpack-mock-server#usage-with-multiple-entries-by-pattern-wildcard
        webpackMockServer.use(app, {
          entry: [],
          tsConfigFileName: "tsconfig.mock.json",
          before: (req, _res, next) => {
            console.log(`Got request: ${req.method} ${req.url}`, req.body);
            next();
          },
        }),
      contentBase: assets, // folder with static content
      watchContentBase: true, // enable hot-reload by changes in contentBase folder
    },
  };

  if (proxy) {
    delete extendedConfig.devServer.before;
  } else {
    delete extendedConfig.devServer.proxy;
  }

  return merge(devConfig, extendedConfig);
};

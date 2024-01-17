const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  plugins: [
    new webpack.DefinePlugin({
      OAUTH_REDIRECT_URI: JSON.stringify(process.env.OAUTH_REDIRECT_URI)
    })
  ],
  module: {
    rules: require('./webpack.rules'),
  },
};

const path = require('path');

/* CONSTANTS */
const CPUS = require('os').cpus().length;
const SOURCE_DIR = path.resolve(process.cwd(), 'src');
const CONFIG_DIR = path.resolve(process.cwd(), '.config');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: {
              // 1 cpu for system and one for 1 cpu for the fork-ts-checker-webpack-plugin
              workers: CPUS >= 4 ? CPUS - 2 : 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              // happyPackMode mode to speed-up compilation and reduce errors reported to webpack
              happyPackMode: true,
            },
          },
          'angular2-template-loader',
        ],
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(SOURCE_DIR, 'tsconfig.app.json'),
      tslint: path.join(CONFIG_DIR, 'tslint.config.js'),
      checkSyntacticErrors: true,
    }),
  ],
};

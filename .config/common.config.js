const path = require('path');

/* PLUGINS */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/* CONSTANTS */
const CPUS = require('os').cpus().length;
const SOURCE_DIR = path.resolve(process.cwd(), 'src');
const CONFIG_DIR = path.resolve(process.cwd(), '.config');

module.exports = {
  context: SOURCE_DIR,

  entry: './extension.ts',

  externals: {
    vscode: {
      commonjs2: 'vscode',
    }
  },

  target: 'node',

  resolve: {
    extensions: ['.js', '.ts'],
  },

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
        ],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        loader: [
          'to-string-loader',
          'css-loader',
        ],
      }
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(process.cwd(), 'tsconfig.json'),
      tslint: path.join(CONFIG_DIR, 'tslint.config.js'),
      checkSyntacticErrors: true,
    }),
    {
      apply: function (compiler) {
        const start = () => process.stdout.write(`${new Date().toLocaleTimeString('en-US')} - File change detected. Starting incremental compilation...\n`);
        const end = () => process.stdout.write(`${new Date().toLocaleTimeString('en-US')} - Compilation complete. Watching for file changes.\n`);
        compiler.hooks.watchRun.tap('VSCodeTask', start);
        compiler.hooks.done.tap('VSCodeTask', end);
        compiler.hooks.invalid.tap('VSCodeTask', end);
      },
    }
  ],

  node: {
    fs: 'empty' // avoids error messages
  },
};

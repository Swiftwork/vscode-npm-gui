const path = require('path');

/* PLUGINS */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');

/* CONSTANTS */
const CPUS = require('os').cpus().length;
const SOURCE_DIR = path.resolve(process.cwd(), 'src');
const CONFIG_DIR = path.resolve(process.cwd(), '.config');

module.exports = {
  context: SOURCE_DIR,

  entry: './extension.ts',

  output: {
    libraryTarget: 'commonjs2'
  },

  externals: {
    'vscode': {
      commonjs2: 'vscode',
    },
    'npm-check-updates': {
      commonjs2: 'npm-check-updates',
    }
  },

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
        test: /\.js$/,
        include: [path.join(SOURCE_DIR, 'pane')],
        loader: [
          'to-string-loader',
        ],
      },
      {
        test: /\.css$/,
        include: [path.join(SOURCE_DIR, 'pane')],
        loader: [
          'to-string-loader',
          'css-loader',
        ],
      },
      {
        test: /\.hbs$/,
        include: [path.join(SOURCE_DIR, 'pane')],
        loader: 'handlebars-loader',
      },
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

  devtool: 'source-map',
};

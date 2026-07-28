const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// Bind-mounted source in Docker (Windows/macOS) does not forward inotify events,
// so the container sets WEBPACK_POLL to switch the watcher over to polling.
// Left unset on the host, where native filesystem events are faster and cheaper.
const poll = process.env.WEBPACK_POLL ? Number(process.env.WEBPACK_POLL) : undefined;

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    watchOptions: {
      ...options.watchOptions,
      ignored: /node_modules/,
      ...(poll ? { poll, aggregateTimeout: 300 } : {}),
    },
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  };
};

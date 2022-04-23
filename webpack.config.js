module.exports = {
  resolve: {
    fallback: {
      url: require.resolve('url/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer/'),
      zlib: require.resolve('browserify-zlib'),
    },
    alias: {
      process: 'process/browser',
    },
  },
  plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};


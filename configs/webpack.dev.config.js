let sharedConfig = require('./webpack.shared.config.js');

sharedConfig.devtool = 'inline-eval-source-map';

module.exports = sharedConfig;

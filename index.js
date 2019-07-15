var loaderUtils = require('loader-utils');
var replacer = require('./replacer.js')

var options

module.exports = function (source) {
  if (!options) {
    options = Object.assign(
      { isDebug: process.env.NODE_ENV === 'development' }, //默认的isDebug
      loaderUtils.getOptions(this)
    );
  }
  return replacer.replaceMatched(source, options)
};

var loaderUtils = require('loader-utils');
var replacer = require('./replacer.js')


module.exports = function (source) {
    var options = loaderUtils.getOptions(this)
    if (!('isDebug' in options)) {
        options.isDebug = process.env.NODE_ENV === 'development'; //默认的isDebug
    }
    return replacer.replaceMatched(source, options)
};

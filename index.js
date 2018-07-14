var loaderUtils = require('loader-utils');

module.exports = function (source, inputSourceMap) {
    console.log(inputSourceMap)
    var opts = loaderUtils.getOptions(this) || {};
    return replaceIfDebug(source, opts)
};

function replaceIfDebug(js, opt) {
    var isDebug = opt.isDebug !== false; //默认isDebug为true
    var reg = /\/\*IFDEBUG([\s\S]+?)FIDEBUG\*\//g;
    return js.replace(reg, isDebug ? "$1" : "");
}
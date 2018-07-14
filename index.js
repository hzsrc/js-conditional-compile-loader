var loaderUtils = require('loader-utils');

module.exports = function (source) {
    var opts = Object.assign(
        {isDebug: process.env.NODE_ENV === 'development'}, //默认isDebug
        loaderUtils.getOptions(this)
    );
    return replaceIfDebug(source, opts)
};

function replaceIfDebug(js, opt) {
    var isDebug = opt.isDebug !== false;
    var reg = /\/\*IFDEBUG([\s\S]+?)FIDEBUG\*\//g;
    return js.replace(reg, isDebug ? '$1' : '');
}
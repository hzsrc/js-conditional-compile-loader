var loaderUtils = require('loader-utils');
var REG = /\/\*\s*IFDEBUG([\s\S]+?)FIDEBUG\s*\*\//g;

module.exports = function (source) {
    var opts = Object.assign(
        {isDebug: process.env.NODE_ENV === 'development'}, //默认isDebug
        loaderUtils.getOptions(this)
    );
    return replaceIfDebug(source, opts)
};

function replaceIfDebug(js, opt) {
    var isDebug = opt.isDebug !== false;
    return js.replace(REG, isDebug ? '$1' : '');
}

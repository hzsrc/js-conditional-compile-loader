var loaderUtils = require('loader-utils');
var REG = /\/\*\s*IF(DEBUG|TRUE\w+)([\s\S]+?)FI\1\s*\*\//g;

module.exports = function (source) {
  var options = Object.assign(
    { isDebug: process.env.NODE_ENV === 'development' }, //默认的isDebug
    loaderUtils.getOptions(this)
  );
  return replaceMatched(source, options)
};
module.exports._rp = replaceMatched
module.exports._reg = REG

function replaceMatched(js, options) {
  return js.replace(REG, (match, $1, $2) => {
    var isDropCode;
    if ($1 === 'DEBUG') {
      isDropCode = options.isDebug === false
    } else {
      var varName = $1.slice(5)
      isDropCode = options[varName] === false
    }
    return isDropCode ? '' : $2
  });
}

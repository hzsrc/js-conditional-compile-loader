var REG = /\/\*\s*IF(DEBUG|TRUE_\w+)(?:\s*\*\/)?([\s\S]+?)(?:\/\*\s*)?FI\1\s*\*\//g;

exports.replaceMatched = function (js, options) {
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

// for uint test
exports._reg = REG

var REG = /\/\*\s*IF(DEBUG|TRUE_\w+)(?:\s*\*\/)?([\s\S]+?)(?:\/\*\s*)?FI\1\s*\*\//g;

exports.replaceMatched = function (js, options) {
  return js.replace(REG, (match, $1, $2) => {
    var isKeep;
    if ($1 === 'DEBUG') {
      isKeep = options.isDebug
    } else {
      var varName = $1.slice(5)
      isKeep = options[varName]
    }
    return isKeep ? $2 : ''
  });
}

// for uint test
exports._reg = REG

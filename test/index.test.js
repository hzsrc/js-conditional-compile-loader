var plugin = require('../index')
var glob = require('glob')
var fs = require('fs')
var path = require('path')

var resolve = path.resolve.bind(null, __dirname)

// glob(resolve('./src/**/*.js'), function (er, files) {
//   if (er) throw er
//   files.map(file => {
//   })
// })

test('IFDEBUG true', () => {
  testOne('src/IFDEBUG.js', { isDebug: true }, /font-size:13px[\s\S]+this.ruleData/)
})

test('IFDEBUG false', () => {
  testOne('src/IFDEBUG.js', { isDebug: false }, /template: ''\s+,\s+watch: \{\s+\}/)
})

test('IFTRUE myFlag=true', () => {
  testOne('src/IFTRUE.js', { myFlag: true }, /font-size:13px[\s\S]+this.ruleData/)
})
test('IFTRUE myFlag=false', () => {
  testOne('src/IFTRUE.js', { myFlag: false }, /template: ''\s+,\s+watch: \{\s+\}/)
})


function testOne(file, options, reg, notReg) {
  var src = fs.readFileSync(resolve(file), 'utf-8')
  var result = plugin._rp(src, options)
  expect(result).toMatch(reg)
  expect(result).not.toMatch(plugin._reg)
}

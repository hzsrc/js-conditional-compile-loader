var replacer = require('../replacer')
var glob = require('glob')
var fs = require('fs')
var path = require('path')

var resolve = path.resolve.bind(null, __dirname)

// glob(resolve('./cases/**/*.js'), function (er, files) {
//   if (er) throw er
//   files.map(file => {
//   })
// })

test('IFDEBUG true', () => {
    testOne('cases/IFDEBUG.js', { isDebug: true }, /font-size:13px[\s\S]+this.ruleData/)
})

test('IFDEBUG false', () => {
    testOne('cases/IFDEBUG.js', { isDebug: false }, /template: ''\s+,\s+watch: \{\s+\}/)
})

test('IFTRUE myFlag=true', () => {
    testOne('cases/IFTRUE.js', { myFlag: true }, /font-size:13px[\s\S]+this.ruleData/)
})
test('IFTRUE myFlag=false', () => {
    testOne('cases/IFTRUE.js', { myFlag: false }, /template: ''\s+,\s+watch: \{\s+\}/)
})


test('Divided true', () => {
    testOne('cases/Divided.js', { isDebug: true, myFlag: true }, /font-size:13px[\s\S]+this.ruleData/)
})
test('Divided false', () => {
    testOne('cases/Divided.js', { isDebug: false, myFlag: false }, /template: ''\s+,\s+watch: \{\s+\}/)
})


test('performance', () => {
    var start = new Date()
    var src = fs.readFileSync(resolve('cases/perform.txt'), 'utf-8')
    for (var i = 0; i < 30; i++) {
        src = '' + Math.random() + new Date() + src
        replacer.replaceMatched(src, { isDebug: false, myFlag: false })
        replacer.replaceMatched(src, { isDebug: true, myFlag: true })
        replacer.replaceMatched(src, { isDebug: false, myFlag: true })
        replacer.replaceMatched(src, { isDebug: true, myFlag: false })
    }
    var spent = new Date() - start
    expect(spent).toBeLessThan(1000)
})

function testOne(file, options, reg, notReg) {
    var src = fs.readFileSync(resolve(file), 'utf-8')
    var result = replacer.replaceMatched(src, options)
    // fs.writeFileSync(resolve('./dist/' + path.basename(file)), result)

    expect(result).toMatch(reg)
    expect(result).not.toMatch(replacer._reg)
}

var replacer = require('../replacer')
var plugin = require('../index')
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
    testOne('cases/IFDEBUG.js', {isDebug: true}, /font-size:13px[\s\S]+this.ruleData/)
})

test('IFDEBUG false', () => {
    testOne('cases/IFDEBUG.js', {isDebug: false}, /template: ''\s+,\s+watch: \{\s+\}/)
})

test('IFTRUE myFlag=true', () => {
    testOne('cases/IFTRUE.js', {myFlag: true}, /font-size:13px[\s\S]+this.ruleData/)
})
test('IFTRUE myFlag=false', () => {
    testOne('cases/IFTRUE.js', {myFlag: false}, /template: ''\s+,\s+watch: \{\s+\}/)
})


test('Divided true', () => {
    testOne('cases/Divided.js', {isDebug: true, myFlag: true}, /font-size:13px[\s\S]+this.ruleData/)
})
test('Divided false', () => {
    testOne('cases/Divided.js', {isDebug: false, myFlag: false}, /template: ''\s+,\s+watch: \{\s+\}/)
})


test('Vue true', () => {
    testOne('cases/css-ts-vue.vue', { isDebug: true, myFlag: true }, [
        /This is a test!/,
        /falgData: 'Flag Data'/,
        /any-where-test/,
        /test-for-css/,
    ])
})
test('Vue false', () => {
    testOne('cases/css-ts-vue.vue', { isDebug: false, myFlag: false }, [
        /<div>\s+<\/div>/,
        / data: {\s+}/,
        /<\/script>\s+<style id=/,
        /scoped>\s+<\/style>/,
    ])
})

test('performance', () => {
    var start = new Date()
    var src = fs.readFileSync(resolve('cases/perform.txt'), 'utf-8')
    for (var i = 0; i < 100; i++) {
        src = '' + Math.random() + new Date() + src
        mockPlugin(src, {isDebug: false, myFlag: false})
        mockPlugin(src, {isDebug: true, myFlag: true})
        mockPlugin(src, {isDebug: false, myFlag: true})
        mockPlugin(src, {isDebug: true, myFlag: false})
    }
    var spent = new Date() - start
    expect(spent).toBeLessThan(1000)
})


test('IFDEBUG default ifDebug', () => {
    process.env.NODE_ENV = 'development'
    //expect(process.env.NODE_ENV).toMatch(/development/)
    testOne('cases/IFDEBUG.js', {}, /font-size:13px[\s\S]+this.ruleData/)
})

function testOne(file, options, reg) {
    var src = fs.readFileSync(resolve(file), 'utf-8')
    var result = mockPlugin(src, options);
    // fs.writeFileSync(resolve('./dist/' + path.basename(file)), result)
    [].concat(reg).map(r => expect(result).toMatch(r))
    expect(result).not.toMatch(replacer._reg)
}

function mockPlugin(src, option) {
    return plugin.call({query: option}, src)
}

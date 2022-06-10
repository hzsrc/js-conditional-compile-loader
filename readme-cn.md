# js-conditional-compile-loader

- [English](https://github.com/hzsrc/js-conditional-compile-loader/blob/master/readme.md)
- [插件介绍](https://segmentfault.com/a/1190000020102151)

一个条件编译的webpack loader, 支持按条件构建各种代码文件，如js、ts、vue、css、scss、html等。   
**条件编译**，是指 用同一套代码和同样的编译构建过程，根据设置的条件，选择性地编译指定的代码，从而输出不同程序的过程。  

- 比如：用一套代码实现debug和release环境输出两套不同js程序，debug时直接输出各种数据信息编译开发调试，release时完全不包含这些代码。   
    - 又如：用一套代码和构建过程针对不同客户编写不同的定制代码，发布时通过不同的命令发布不同的程序：如`npm run build --ali`发布针对ali的程序，`npm run build --tencent`发布针对tencent的程序。


### 用法
插件提供了`IFDEBUG`和`IFTRUE`两个条件编译指令。用法是：在js代码的任意地方以`/*IFDEBUG`或`/*IFTRUE_xxx`开头，以`FIDEBUG*/`或`FITRUE_xxx*/`结尾，中间是被包裹的js代码。`xxx`是在webpack中指定的options条件属性名，比如`myFlag`。

- 模式1 - 全注释:   
因为采用了js注释的形式，故即使不使用js-conditional-compile-loader，也不影响js代码的运行逻辑。
````js
    /*IFDEBUG Any js here FIDEBUG*/
````

````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````
- 模式2（首+尾）：   
这种模式下，可使用eslint校验你的代码。
````js
/* IFDEBUG */
var anyJsHere = 'Any js here'
/*FIDEBUG */
````

````js
/* IFTRUE_yourFlagName*/ 
function anyJsHere(){
}
/*FITRUE_yourFlagName */
````

----
### 由源码输出的结果
源码：
````js
/* IFTRUE_forAlibaba */
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
/* FITRUE_forAlibaba */

$state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
````
当options为`{isDebug: true, forAlibaba: true}`时，构建后输出的内容:
````js
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()

$state.go('win', {dir: menu.winId, reload: true })
````

当options为`{isDebug: false, forAlibaba: false}`时，构建后输出的内容:
````js
$state.go('win', {dir: menu.winId})
````
----


### 安装
````bash
    npm i -D js-conditional-compile-loader
````

### webpack配置
这样修改webpack配置:     
查看样例： [vue-element-ui-scaffold-webpack4](https://github.com/hzsrc/vue-element-ui-scaffold-webpack4)
`js-conditional-compile-loader`需要作为处理源文件的第一步，即放在use数组的末尾。   
如下例子为vue、js文件的配置，ts文件的配置类似。css、scss等样式的配置略复杂，可参考[这个样例](https://github.com/hzsrc/vue-element-ui-scaffold-webpack4/blob/master/build/utils.js)

````js
const conditionalCompiler = {
    loader: 'js-conditional-compile-loader',
    options: {
        isDebug: process.env.NODE_ENV === 'development', // optional, this expression is default
        envTest: process.env.ENV_CONFIG === 'test', // any prop name you want, used for /* IFTRUE_evnTest ...js code... FITRUE_evnTest */
        myFlag: process.env.npm_config_myflag, // enabled when running command: `npm run build --myflag`
    }
}

module.exports = {
    // others...
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader', conditionalCompiler],
            },
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                use: [
                    //step-2
                    'babel-loader?cacheDirectory',
                    //step-1
                    conditionalCompiler,
                ],
            },
            // others...
        ]
    }
}
````
### options 配置
- isDebug: boolean

如果`isDebug` === false，则所有`/\*IFDEBUG` 和 `FIDEBUG\*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

`isDebug`默认取值为：process.env.NODE_ENV === 'development'

- changeSource: Function(source, options)

自定义的修改源码函数。可选。比如对于后端为java环境时，将代码中的`.aspx`替换为`.do`：
````js
var options = {
    changeSource: process.env.npm_config_java ? source => source.replace(/\.aspx\b/i, '.do') : null
}
````


- 其他任意属性名：boolean

如果 [属性值] === false，则所有`/\* IFTRUE_属性名` 和 `FITRUE_属性名 \*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

	
## 用法举例 -- 任意源码，任意位置！
条件编译指令可以用在任意源代码文件的任意位置，不受代码语法限制。    
例如：

* 1
````typescript
const tx = "This is app /* IFTRUE_Ali of debug FITRUE_Ali */ here";


/*IFDEBUG
let tsFunc = function(arr: number[]) : string {
    alert('Hi~');
    return arr.length.toString()
}
FIDEBUG*/
````

* 2:
````scss
/* IFTRUE_myFlag */
div > ul > li {
    a {
        color: red;
    }
}
/*FITRUE_myFlag */


h2{
    background: red;
    /* IFTRUE_myFlag 
    color: blue;
    FITRUE_myFlag */
}
````

* 3
```js
Vue.component('debugInfo', {
    template: ''
    /* IFDEBUG
        + '<pre style="font-size:13px;font-family:\'Courier\',\'Courier New\';z-index:9999;line-height: 1.1;position: fixed;top:0;right:0; pointer-events: none">{{JSON.stringify($attrs.info || "", null, 4).replace(/"(\\w+)":/g, "$1:")}}</pre>'
    FIDEBUG */
    ,
    watch: {
      /* IFTRUE_myFlag */
      curRule (v){
          this.ruleData = v
      },
      /*FITRUE_myFlag */
    },
});
```

* 4
```vue
<temeplate>
    <div>
        /* IFTRUE_myFlag
        <h2>This is a test! For HTML. vue模板内也可以使用！</h2>
        <pre>
            {{$attrs.info || ''}}
        </pre>
        FITRUE_myFlag */
    </div>
</temeplate>

<script>
    var vueComponent = {
        data: {
            /* IFTRUE_myFlag
            falgData: 'Flag Data',
            FITRUE_myFlag */
        },
    };
</script>

/* IFTRUE_myFlag*/
<style scoped>
    .any-where-test {
        color: red;
    }
</style>
/* FITRUE_myFlag*/


<style id="a" scoped>
    /* IFTRUE_myFlag*/
    .test-for-css {
        color: red;
    }
    /*FITRUE_myFlag */
</style>
```

# js-conditional-compile-loader

- [中文文档](https://github.com/hzsrc/js-conditional-compile-loader/blob/master/readme-cn.md)

A javascript conditional compiling loader for webpack.    
Conditional compiling means that we can use the same codes and compiling process, to build different applications with different  environment conditions.   
For example: we can output two different program for debug or release environment with a same source code project.    

### Usage
This loader provides two commands: `IFDEBUG` and `IFTRUE`. Just use them anywhere in js code like this: Start with `/*IFDEBUG` or `/*IFTRUE_xxx`, end with `FIDEBUG*/` or `FITRUE_xxx*/`, place js code in the center. The `xxx` is any condition property of the options in webpack, such like `myFlag`.
     
- Mode 1 - comment all   
Since it is designed by a js comment style, the code can run normaly even though the js-conditional-compile-loader is not used.    
````js
/* IFDEBUG Any js here FIDEBUG */
````

````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````

- Mode 2 -- head and foot   
In this mode, you can use eslint to check your code.
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
### Build result with source code
Source code:
````js
/* IFTRUE_forAlibaba */
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
/* FITRUE_forAlibaba */
$state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
````
Compiled output by options: `{isDebug: true, forAlibaba: true}`:
````js
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
$state.go('win', {dir: menu.winId, reload: true })
````

Compiled output by options: `{isDebug: false, forAlibaba: false}`:
````js
$state.go('win', {dir: menu.winId})
````
----

### Setup
````bash
    npm i -D js-conditional-compile-loader
````

### Config in webpack
Change webpack config like this:    
See this sample: vue-element-ui-scaffold-webpack4(https://github.com/hzsrc/vue-element-ui-scaffold-webpack4)
`js-conditional-compile-loader` needs to be add as step 1 for js files.
````js
module: {
    rules: [
        {
            test: /\.js$/,
            include: [resolve('src'), resolve('test')],
            use: [
                //step-2
                'babel-loader?cacheDirectory',
                //step-1
                {
                  loader: 'js-conditional-compile-loader',
                  options: {
                    isDebug: process.env.NODE_ENV === 'development', // optional, this expression is default
                    myFlag: process.env.ENV_COMPANY === 'ALI',  // any name you want, used for /* IFTRUE_myFlag ...js code... FITRUE_myFlag */
                  }
                },
            ]
        },
        //other rules
    ]
}
````
### options
- isDebug: {bool = [process.env.NODE_ENV === 'development']}

 If isDebug === false, all the codes between `/\*IFDEBUG` and `FIDEBUG\*/` will be removed, otherwise the codes will be remained.     

- \[any propertyName\]：{bool}
if value === false, all codes between `/\* IFTRUE_propertyName` and `FITRUE_propertyName \*/` will be removed, otherwise the codes will be remained.


	
## Samples

* 1:
````js
var tx = "This is app /* IFTRUE_Ali of debug FITRUE_Ali */ here";
````

* 2:
````js
/*IFDEBUG
alert('Hi~');
FIDEBUG*/
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
```javascript
import { Layout } from 'my-layout-component'
var LayoutRun = Layout
/* IFDEBUG
  import LayoutLocal from '../../local-code/my-layout-component/src/components/layout.vue'
  LayoutRun = LayoutLocal
FIDEBUG */

export default {
    components: {
      LayoutRun
    },
}
```

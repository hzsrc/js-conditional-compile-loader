# js-conditional-compile-loader

- [中文文档](https://github.com/hzsrc/js-conditional-compile-loader/blob/master/readme-cn.md)

A javascript conditional compiling loader for webpack. 
Conditional compiling means that we can compile or not compile some js code according to some environment variables.
For example: we can output two different program for debug or release environment with a same source code project.    

### Usage
Just use it anywhere in js code like this:    

````js
/* IFDEBUG Any js here FIDEBUG */
````
or
````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````
Start with "/\*IFDEBUG", end with"FIDEBUG\*/", and js code in the center. you can use it any where in js files.     

* sample -- sorce code:
````js
$state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
````
Output for debug:
````js
$state.go('win', {dir: menu.winId, reload: true })
````

Output of production:
````js
$state.go('win', {dir: menu.winId})
````

* sample2:
````js
var tx = "This is app /* IFTRUE_Ali of debug FITRUE_Ali */ here";
````

* sample3:
````js
/*IFDEBUG
alert('Hi~');
FIDEBUG*/
````
Since it is designed by a js comment style, the code can run normaly even though the js-conditional-compile-loader is not used.    

### Setup
````bash
    npm i -D js-conditional-compile-loader
````

### Config in webpack
You should change webpack config like this:    
See this sample: vue-element-ui-scaffold-webpack4(https://github.com/hzsrc/vue-element-ui-scaffold-webpack4)

````js
module: {
    rules: [
        {
            test: /\.js$/,
            include: [resolve('src'), resolve('test')],
            exclude: file => (
                /node_modules/.test(file) && !/\.vue\.js/.test(file)
            ),
            use: [
                //step-2
                'babel-loader?cacheDirectory',
                //step-1
                {
                  loader: 'js-conditional-compile-loader',
                  options: {
                    isDebug: process.env.NODE_ENV === 'development', // optional, this is default
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
* 1
```js
Vue.component('debugInfo', {
    template: ''
    /* IFDEBUG
        + '<pre style="font-size:13px;font-family:\'Courier\',\'Courier New\';z-index:9999;line-height: 1.1;position: fixed;top:0;right:0; pointer-events: none">{{JSON.stringify($attrs.info || "", null, 4).replace(/"(\\w+)":/g, "$1:")}}</pre>'
    FIDEBUG */
    ,
    watch: {
      /* IFTRUE_myFlag
      curRule (v){
          this.ruleData = v
      },
      FITRUE_myFlag */
    },
});
```

* 2
```javascript
import { Layout } from 'my-layout-component'
var LayoutRun = Layout
/* IFDEBUG
  import FpLayoutLocal from '../../local-code/my-layout-component/src/components/layout.vue'
  LayoutRun = FpLayoutLocal
FIDEBUG */

export default {
components: {
  LayoutRun
},
}
```

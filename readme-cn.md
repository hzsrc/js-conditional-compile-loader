# js-conditional-compile-loader

一个javascript条件编译的webpack loader。
条件编译指按照需要，按照环境设置的条件，选择性地编译或不编译指定的代码。
比如：用一套代码实现debug和release环境输出两套不同js程序。

### Usage
这样用就行：

````js
    /*IFDEBUG Any js here FIDEBUG*/
````
or
````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````
以“/\*IFDEBUG”开头，以“FIDEBUG\*/”结尾，中间是js代码。可以用在js文件的任意地方。

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
因为采用了js注释的形式，故即使不使用js-conditional-compile-loader，也不影响js代码的运行逻辑。

### 安装
````bash
    npm i -D js-conditional-compile-loader
````

### webpack配置
你需要像这样修改webpack配置:     
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
                        myFlag: process.env.ENV_COMPANY === 'ALI', // any name, used for /* IFTRUE_myFlag ...js code... FITRUE_myFlag */
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

如果isDebug === false，所有`/\*IFDEBUG` 和 `FIDEBUG\*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

- 任意属性名：{bool}
如果 value === false，所有`/\* IFTRUE_属性名` 和 `FITRUE_属性名 \*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

	
## 用法举例
* 1
```js
Vue.component('debugInfo', {
    template: ''
    /* IFDEBUG
        + '<pre style="font-size:13px;font-family:\'Courier\',\'Courier New\';z-index:9999;line-height: 1.1;position: fixed;top:0;right:0; pointer-events: none">{{JSON.stringify($attrs.info || "", null, 4).replace(/"(\\w+)":/g, "$1:")}}</pre>'
    FIDEBUG */
    ,
    watch: {
      /* IFDEBUG
      curRule (v){
          this.ruleData = v
      },
      FIDEBUG */
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

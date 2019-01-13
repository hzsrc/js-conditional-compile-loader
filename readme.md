# js-conditional-compile-loader

A javascript conditional compile loader for webpack. You can easily output two different codes for debug or release environment with one source code.    
(一个javascript条件编译的webpack loader。可以很容易用一套代码实现debug和release环境输出两套不同js代码的。)

### Usage in JS files
Just use it like this:    
(这样用就行)：

    /*IFDEBUG Any js here FIDEBUG*/

Start with "/\*IFDEBUG", end with"FIDEBUG\*/", and js code in the center. you can use it any where in js files.     
(以“/\*IFDEBUG”开头，以“FIDEBUG\*/”结尾，中间是js代码。可以用在js文件的任意地方。)

* sample:

 	  $state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
	
Output for debug:

 	$state.go('win', {dir: menu.winId, reload: true })

Output of production:

	$state.go('win', {dir: menu.winId})
	
* sample2:

	  var tx = "This is app /*IFDEBUG of debug FIDEBUG*/ here";
* sample3:

	  /*IFDEBUG
	  	alert('Hi~');
	  FIDEBUG*/

Since it is designed by a js comment style, the code can run normaly even though the js-conditional-compile-loader is not used.    
(因为采用了js注释的形式，故即使不使用js-conditional-compile-loader，也不影响js代码的运行逻辑。)

### Setup
    npm i -D js-conditional-compile-loader

### Config in webpack
You should change webpack config like this:    
（你需要像这样修改webpack配置:）     
See this sample: vue-element-ui-scaffold-webpack4(https://github.com/hzsrc/vue-element-ui-scaffold-webpack4)

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
                    'js-conditional-compile-loader',
                ]
            },
            //other rules
        ]
    }

### options
- isDebug: {bool = [process.env.NODE_ENV == 'development']}

 If isDebug === false, all the codes between "/\*IFDEBUG" and "FIDEBUG\*/" will be removed, otherwise the codes will be remained.     
（如果isDebug === false，所有"/\*IFDEBUG" 和 "FIDEBUG\*/"之间的代码都会被移除。 其他情况，这些代码则会被保留。）

	

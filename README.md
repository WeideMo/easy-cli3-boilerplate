# easy-cli3-boilerplate

![Vue实战：一口气理解和配置你的vue-cli3项目](https://www.moweide.com/vue_inaction_cli3/cover.jpg)


Vue实战系列教程二，本篇是针对线上项目从cli2升级到cli3的一个过程，记录了升级（爬坑）过程，其中包括了`cli3的变化`， `vue.config.js的关键配置`，以及 `项目结构组织` 和 `构建流程优化` 等内容，对 `cli3` 项目搭建中应知应会的知识点做了一个实践总结。

<!-- more -->

实战系列之前有 `Vue.js渡劫系列`, 读者如果有兴趣也可以先进行通用了解，附上传送门：

<a style="color:#16bc5a" href="https://moweide.com/2017/09/02/vue_started/">『Vue实战系列一：简单几步，优化你的开发体验与效率』</a>

<a style="color:#16bc5a" href="https://moweide.com/2017/09/02/vue_started/">『Vuejs渡劫系列一：日常开发中必须掌握的细节（keng）』</a>

<a style="color:#16bc5a" href="https://moweide.com/2017/09/24/vue_wp_configs">『Vuejs渡劫系列二：最全的vue-cli项目下的配置简析』</a>

<a style="color:#16bc5a" href="https://moweide.com/2017/12/04/vue_cli_project/">『Vuejs渡劫系列三：构建一个包含路由控制、状态管理和权限校验的vue-cli项目』</a>

## 基础

### 安装

安装这部分其实 `CLI 3` 官网已经叙述的比较清楚，原本是想直接跳过这part，但是考虑到连贯性，还是对安装部分简单的总结以下几点：

* `npm install -g @vue/cli` 进行全局安装
* 可通过 `vue create [projectname]` or `vue ui`进行可视化创建项目


### cli-service 和 cli-plugin

cli-service 是整个CLI的开发环境依赖，和cli-plugin则是插件，可以理解为`容器` 和 `插件` 的关系，通过查看 `package.json` 的 `devDependencies`:

```json
"devDependencies": {
    "@vue/cli-plugin-babel": "^3.6.0",
    "@vue/cli-plugin-eslint": "^3.6.0",
    "@vue/cli-plugin-pwa": "^3.6.0",
    "@vue/cli-plugin-unit-mocha": "^3.6.0",
    "@vue/cli-service": "^3.6.0"
  },
```
我们不难发现了，规律性的插件命名，和显眼的cli-service，通过基于 `cli-service`的底层环境，结合各种实用的 `cli-plugin-x`插件，是 `CLI 3`的核心组成部分。


## CLI 3 的变化

### 组织结构

新的 `CLI` 毕竟是大版本的迭代，因此在文件组织结构上也带来了一定的变化，简单的归纳为 `约定大于配置`，这个思想也很符合行业的主流，以下是一些主要的组织结构变动： 

> webpack build 配置移除

在 `CLI 3` 中，我们会发现根目录下的 `/build`目录被移除了，原有通过 `webpack.[env].conf.js` 文件去配置不同环境的构建更改为 `configureWebpack `对象的配置，笔者认为文件的方式相对更为直观，而通过对象配置，更为简洁，有点springBoot中通过 `config bean`的味道。

> 环境变量和模式

在 `CLI 2`中，环境变量统一放在 `/config`中管理，而在 `CLI 3`中，则需要在根目录下新建对应的环境文件，如下图所示：

![Events](https://www.moweide.com/vue_inaction_cli3/cli3_env.png)

通过文件名去标识不同的模式，在执行特定模式构建时，环境文件将会被加载，如在 `package.json` 中增加一个包分析的构建脚本

```json
"scripts": {
   "analyz": "vue-cli-service build --mode analyz"
  },
```
则在执行 `npm run analyz` 时，会自动加载根目录下的 `.env.analyz`中的环境变量。


> 资源文件目录

相对 `CLI 2`, 新版的资源目录从原来的 `static`=> `public`，原来的模板文件 `index.html`，迁移至 `/public/index.html`

> 更简洁的根目录

在 `CLI 2`中，很多插件的配置会放置在根目录，如 `.babelrc`， `.postcssrc.js` 等配置，现在都可以在统一配置在 `package.json`中了。


## 项目结构组织

在对 `CLI 3`进行配置之前，我们有必要对项目结构进行调整，其中包括新建一些文件配置，以及增加一些工具等，使得我们的脚手架能更优。

### 新建环境文件

在根目录下，新建 `.env`， `.env.production` ，`.env-anaylyz` 等环境文件，并在对应的文件中配置好对应的环境变量，如 `NODE_ENV` 等，以下是 `.env.analyz`中的环境变量，通过判断 `IS_ANALYZ`的值，可以判断当前构建模式是否在 `analyz` mode下。

```bash
NODE_ENV = 'production'
IS_ANALYZ = 'analyz'
```

### 在package.json中统一管理配置

前文也提到过，针对一些插件的配置，我们可以使用 `package.json` 对其统一管理，以下是针对 `eslint`， `postcss`，`babel浏览器兼容列表` 等配置

> elsint配置

```json
"eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
  }
```
> postcss处理

```json
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  }
```
> 浏览器兼容性
```json
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
```
`CLI 3`在构建过程中会通过扫描 `package.json` 的关键字去结合处理，达到通过将配置集中化处理的目的。


### 注册全局组件 

很多时候，我们需要注册一些通用的全局组件，减少重复import的工作量，此时我们可以在 `/src/components/common`下新建组件，然后新建一个 `registerGlobalComponents` 扫描文件，去自动帮我们扫描注册 `Global Components`：

```javascript
// registerGlobalComponents.js

/**
*{全局扫描注册组件}
*/
import Vue from 'vue'

// 自动加载 common 目录下的 .js 结尾的文件
const componentsContext = require.context('@/components/common', true, /\.js$/)

componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  const ctrl = componentConfig.default || componentConfig
  Vue.component(ctrl.name, ctrl)
})

```
后续如果我们需要新增全局组件，只需在`/src/components/common`下新建组件，及通过组件入口 `index.js` 引用即可，详情可以参考demo项目。

### 状态与路由

鉴于状态和路由的配置，边幅较大，不在此文展开，后续实战系列会说到，请期待。

## vue.config.js 配置

讲了这么久，终于到了主角 `vue.config.js` 的配置，作为 `CLI 3`的统一配置文件，刚更新的同学可能会一脸懵逼，因为对比原有的文件直观性，`CLI 3`的配置可以说变得更抽象，如果是初学者更是晦涩难懂，这里不会对所有API 一个个说，只是针对一些实用性强的配置进行举例使用：

### publicPath

在`v3.3`之前，又叫 `baseUrl`,可以理解为项目的一个contextPath，默认为`/`, 如果你配置了为 `yourProjectPath`，那么在构建后，所有引用的路径都会带上 `yourProjectPath` ：

```javascript
// vue.config.js 
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
// yourProject Context-path
const productionPath = '/yourProjectPath/'
module.exports = {
  publicPath: IS_PROD ? productionPath : '/'
}
```

如我们在后端服务中，如spring-boot的配置中，增加了一个名为 `yourProjectPath` 的项目路径，就可以如上设置，去区分开发环境和生产环境。

### assetsDir

构建后的资源输出路径，默认是直接生成在 `/dist`下，但是如果为了方便资源管理，我们一般会新建一个 `static`的目录，通过配合后端服务的静态资源路径使用：

```javascript
// vue.config.js 
module.exports = {
  assetsDir: 'static'
}
```

在配置完成后，执行项目构建 `npm run build` 之后，所有的打包资源路径都有附带路径前缀 `/yourProjectPath/static/xxx.js` 或 `/yourProjectPath/static/xxx.css`

### lintOnSave

在安装了 `@vue/cli-plugin-eslint` 之后才会生效，默认是安装插件后会自动开启，插件会根据你配置的eslint校验规则去检查，如果团队开发不能统一规范的，这意味着你的代码面临编译不通过的风险，此时可以通过配置:

```javascript
// vue.config.js 
module.exports = {
  lintOnSave: false
}
```

### productionSourceMap

通过配置 `productionSourceMap` 来告诉打包编译时，是否需要在生产环境中生成对应的sourceMap：

```javascript
// vue.config.js 
module.exports = {
  lintOnSave: true
}
```
如果项目需要在生产环境排查和调试，建议开始，否则可以关闭提高构建速度。

### configureWebpack

通过定义一个配置对象，改对象会通过 `webpack-merge` 插件合并到最终的webpack配置，官方写的很清楚了，大概是这样的一个样子：

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```
这里的 `MyAwesomeWebpackPlugin` 就是你构建中需要使用的插件，当然要通过import才能使用，这里写的比较简单，后文会通过实例继续说明。

### css.loaderOptions

该选项，提供了一个针对CSS预处理的统一配置入口，包括了`Sass`、`Less`等的，如我们在应用中有一个包含了网站的颜色、大小的变量scss文件 `variables.scss`，通过以下配置可以传入共享的变量：

```javascript
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        data: `@import "~@/variables.scss";`
      }
    }
  }
}
```
不难理解，其实就是在构建过程中，切面式的注入了全局样式，以减少一些高频文件的引入重复工作。

### chainWebpack

改选项也是版本改动变化里的一个大头，简单而言就是 `CLI 3`通过 `webpack-chain`的方式，去组织了部分webpack构建的配置，对于熟悉的人而言会变得更简洁，但是个人感觉这部分有点晦涩和抽象了，下面是我整合的一些配置，分别包括了 `添加别名`， `html取消压缩`, `打包分析`等：

```javascript
// vue.config.js
module.exports = {
chainWebpack: config => {
    // 添加别名
    config.resolve.alias
     .set('@', resolve('src'))
     .set('@assets', resolve('src/assets'))
     .set('@components', resolve('src/components'))
     .set('@router', resolve('src/router'))
     .set('@views', resolve('src/views'));
    //  html页面禁止压缩
    config
      .plugin('html')
          .tap(args=>{
              args[0].minify = false;
              return args;
    });
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report')
       .use(BundleAnalyzerPlugin, [{
        analyzerMode: 'static',
       }]);
    }
  }
}
```
其中，`config.resolve` ， `config.plugin` 其实就是对应webpack 下面的 `resolve` 和 `plugin` 配置，其实不难懂，参考我的例子和对应的webpack插件和配置项，就可以照葫芦画瓢。

同时，如果我们不满意默写， 可以通过 `clear()` 方法清除旧规则后去复写新的规则。

### devServer.proxy

该选项是针对开发环境的一个代理服务，通过URL的 requestMaping 转发到对应后端服务上：
```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }
}
```
由于项目里已经用了`yapi`，所以就没配置 `proxy` 项了，有兴趣的同学也可以了解下  [`yapi(传送门)`](https://github.com/YMFE/yapi)

### parallel
基于node 的 `os` module去判断操作系统里的CPU是否支持并行构建，以提高构建速度。
```javascript
// vue.config.js
module.exports = {
  parallel: require('os').cpus().length > 1
}
```

## 构建流程优化

基于 `CLI 3`的脚手架去构建项目，其实有使用 `CLI 2`的用户都知道，提升了已经不止一点点了，当然，作为一个爱折腾的玩家而言，我们还可以继续润色：

### 生产模式下启用 Gzip 压缩

通过在构建过程中使用 `CompressionWebpackPlugin` 插件，在前端构建时完成.gz文件输出：

```javascript
// vue.config.js
module.exports = {
  configureWebpack: config => {
    // 生产模式启用gzip压缩
    if (IS_PROD) {
      const plugins = [];
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        });
      // 合并plugins
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];
    }
  }
}
```
通过在 `configureWebpack` 中新创建一个空数组，然后通过解构语法，合并到原始的 `config.plugins` 中，完成配置合并。

### DLL 动态链接库，分离稳定三方库

这个其实不是什么新鲜技术，简单理解就是将一些相对稳定的 `node module` 从最终的输出文件中分离的技术，达到了文件 `动静分离`，优化构建及浏览器侧缓存的的应用，下面例子是基于 `DllReferencePlugin` 插件实现的：

```javascript
// vue.config.js
module.exports = {
  configureWebpack: config => {
    // 生产模式启用gzip压缩
    if (IS_PROD) {
      const plugins = [];
      plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require('./public/vendor/vendor-manifest.json')
        }),
         // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, './public/vendor/*.js'),
          // dll 引用路径
          publicPath: `/${process.env.BASE_URL}/js/vendor`,
          // dll最终输出的目录
          outputPath: '/js/vendor'
        });

      // 合并plugins
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];
    }
  }
}
```

在使用中，我们需要在根目录下，新增1个 `dll.config.js` 的文件，里面主要是通过配置你常用的稳定模块，告诉webpack后续打包，单独输出到一个vendor文件中，下面是我的栗子：

```javascript
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
 
// dll文件存放的目录
const dllPath = 'public/vendor'
 
module.exports = {
 entry: {
  // 需要提取的库文件
  vendor: ['vue', 'vue-router', 'vuex', 'axios']
 },
 output: {
  path: path.join(__dirname, dllPath),
  filename: '[name].dll.js',
  // vendor.dll.js中暴露出的全局变量名
  // 保持与 webpack.DllPlugin 中名称一致
  library: '[name]_[hash]'
 },
 plugins: [
  // 清除之前的dll文件
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns:['*.*']
  }, {
   root: path.join(__dirname, dllPath)
  }),
  // 设置环境变量
  new webpack.DefinePlugin({
   'process.env': {
    NODE_ENV: 'production'
   }
  }),
  // manifest.json 描述动态链接库包含了哪些内容
  new webpack.DllPlugin({
   path: path.join(__dirname, dllPath, '[name]-manifest.json'),
   // 保持与 output.library 中名称一致
   name: '[name]_[hash]',
   context: process.cwd()
  })
 ]
}
```
同时，在 `package.json` 里需要新增一个 `npm script: dll` , 大概长这个样子：

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "dll": "webpack -p --progress --config ./dll.config.js"
  }
```

通过实行一次（以后在依赖库没有变化的时候不用执行）`npm run dll`操作，即会自动在 `'./public/vendor/vendor-manifest.json'` 下生成一份manifest文件，可用插件使用。

后续每次执行编译操作的时候，你可以惊喜发现稳定的依赖库，被打到了 `'dist/vendor/vendor.dll.js'` 和 `'dist/vendor/vendor.dll.js.gz'` 中：

可能细心的同学会发现，我们还用了一个 `AddAssetHtmlPlugin` 插件，用来把单独生产的 `vendor.dll.js` 文件放到了我们 `index.html` 中，这样优雅而快捷的方式是不是十分迷人。

### 开启 PWA

`PWA(Progressive Web App)` 是一种增加 `web app`的离线功能的技术，这里介绍如何在 `CLI 3`中使用：

首先我们需要安装 `"@vue/cli-plugin-pwa"` 插件，安装后，默认已经在 `src/registerServiceWorker` 中完成了配置：

```javascript
/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}dist/service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      console.log('Service worker has been registered.')
      console.log(registration)
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

```
注意的是，我这里更改了注册使用路径 register(`${process.env.BASE_URL}dist/service-worker.js`, 与此同时需要在 `vue.config.js`中配置下 `pwa` 选项：

```javascript
// vue.config.js
module.exports = {
  pwa: {
    manifestPath:'dist/manifest.json'
  }
}
```

Post Build 处理

由于很多时候单页面应用项目都作为 `Java Web` 应用的war包部分代码嵌入，所以这个时候，就必须要针对后端引擎进行修改，由于该处理启发与Jenkins的 `构建后处理`，所以笔者取名为 `Post Build`，起作用就是在 `npm run build` 完成后进行后处理，例如 `替换jsp模板代码` ，`index.html增加额外样式` 或 `对模板文件做特殊处理`等：

第一步，先新增 `post-build` script:

```json
"scripts": {
    "postbuild": "node ./build/postbuild.js",
  },
```

第二步，在根目录下创建 `/build/postbuild.js` 文件，如我们需要在spring-boot的 `thymleaf` 模板引擎下处理下（包括了替换manifest文件、注入session变量等）：

```javascript
'use strict'
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const __dirDist = path.resolve(__dirname, "../dist");
//读取并替换
fs.readFile( __dirDist +'/service-worker.js','utf8',(err, data)=>{    
    if(err) {
        console.log('error:' + err);
        return;
    };  
    let output = data.replace('/projectname/precache-manifest', '/projectname/dist/precache-manifest');
    fs.writeFile(__dirDist + '/service-worker.js', output, 'utf8', function (err) {
      if (err) console.log(err);
      return;
    });
});
const replaceString = '<script th:inline="javascript" type="text/javascript">';
//注入后端传入的session变量
const targetStr = '<script th:inline="javascript" type="text/javascript">window.user = JSON.parse([[${session.user}]]);'
fs.readFile( __dirDist +'/index.html','utf-8',(err, data)=>{    
    if(err) {
        console.log('error:' + err);
        return;
    };
    let result = data.replace(replaceString, targetStr);
    fs.writeFile(__dirDist + '/index.html', result, 'utf8', function (err) {
        if (err)  console.log(err);
        return;
   });
});
//利用 chalk 输出模板替换完成的日期时间并打印到控制台
const finishedTime = new Date();
console.log(chalk.yellow(`模板替换完成：${finishedTime.getFullYear()}-${finishedTime.getMonth()+1}-${finishedTime.getDate()} ${finishedTime.getHours()}:${finishedTime.getMinutes()}:${finishedTime.getSeconds()}`)); 
```


## 总结

回顾对比 `CLI 2`，`CLI 3` 可以说是带来了更先进的操作与思想：包括可视化的创建、容器与插件以及 `约定大于配置`的集中化配置思想等，如果你是要问是否有必要升级到 `CLI 3`，我可以很负责任的说有必要的！ `VUE CLI`工具进化的同时需要一点时间代价去消化，但是其带来的增益是无可估量，当然笔者这份指引仅仅也是冰山一角，如果有错误，恳请斧正。

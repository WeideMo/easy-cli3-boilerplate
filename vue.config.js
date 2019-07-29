const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const webpack = require('webpack')
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const productionPath = '/'

module.exports = {
  //此处根据项目需求设置 @productionPath, 默认为/
  publicPath: IS_PROD ? productionPath : '/',  
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
        }),
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
        })
      );
      // 合并plugins
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];
    }
  },
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
  },
  //并行构建
  parallel: require('os').cpus().length > 1,
  pwa: {
    // manifestPath:'dist/manifest.json'
  }
}
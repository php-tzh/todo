const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')



let config

config = merge(baseConfig, {
  target:'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  devtool: 'source-map',
  output:{
    //模块化方式输出
    libraryTarget:'commonjs2',
    filename:'server-entry.js',
    path:path.join(__dirname,'../server-build')
  },
  //服务端第三方模块不打包
  externals:Object.keys(require('../package.json').dependencies),
  module: {
    rules: [
        {
            test:/\.styl/,
            use:[
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        sourceMap:true//使用前面的sourcemap
                    }
                },
                'stylus-loader'
            ]
        }
    ]
  },
  // import Vue from 'vue'
 
  plugins: [
    new MiniCssExtractPlugin({
        filename:'main.css'//生成的样式文件名称
    }),
     //服务端渲染
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueServerPlugin()///该配置打包不会输出js文件而是一个json文件，通过这个json文件做一些服务端渲染的操作

  ]
})

module.exports = config

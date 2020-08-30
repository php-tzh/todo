const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
let { merge }= require('webpack-merge')
let baseConfig = require('./webpack.config.base')

 const isDev = process.env.NODE_ENV ==='development'
 let config
 const devServer = {
    port:3000,
    host:'0.0.0.0',
    overlay:{
        errors:true
    },
    historyApiFallback:{
        index:'/public/index.html'
    },
    hot:true
}
const defaultPlugins = [
   
    new webpack.DefinePlugin({
        'process.env':{
            NODE_ENV:isDev?'"development"':'"production"'
        }
    }),
    new HTMLPlugin({
        template:path.join(__dirname,'template.html')
    }),
    new VueClientPlugin()


]
 if(isDev){
     config = merge(baseConfig,{
        devtool:'cheap-module-eval-source-map',
         module:{
             rules:[
                {
                    test:/\.styl/,
                    use:[
                        'style-loader',
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
         devServer,
         plugins:defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
         ])

     })
    
}else{
    config = merge(baseConfig,{
        entry:{
            app:path.join(__dirname,'../client/client-entry.js'),
        },
        output:{
            filename : '[name].[chunkhash:8].js'
        },
        module:{
            rules:[
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
        plugins:[
            new MiniCssExtractPlugin({
                filename:'main.css'//生成的样式文件名称
            })
        ],
        optimization:{
            splitChunks:{
                //分隔代码块
                cacheGroups:{
                    //缓存组
                    vendor:{
                        //引用多次第三方模块
                        priority:1,//先抽离第三方模块
                        test:/node_modules/,
                        chunks:'initial',//入口处开始
                        minSize:0,//>0字节
                        minChunks:1,//用过1次以上
                    }
                }
            }
        }    
    })
}

module.exports = config

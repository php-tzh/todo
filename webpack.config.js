const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'
let config = {
    target:'web',
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },{
                test:/\.(gif|jpg|png|jpeg|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,//小于1024转换base64
                            name:'[name].[ext]'
                        }
                    }
                ]
            },{
                test:/\.jsx/,
                loader:'babel-loader'
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev? '"development"':'"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
       
    ]
}
if(isDev){
    config.module.rules.push(
        {
            test:/\.(styl|stylus)$/,
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
    )
    config.devtool='#cheap-module-eval-source-map'
    config.devServer = {
        port:3000,
        host:'0.0.0.0',
        overlay:{
            errors:true
        },
        hot:true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
    
}else{
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test:/\.(styl|stylus)$/,
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
    )
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename:'main.css'//生成的样式文件名称
        })
    )
    config.entry={
        app:path.join(__dirname,'src/index.js'),
    }
    config.optimization={
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
}

module.exports = config

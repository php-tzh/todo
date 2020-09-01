const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const createVueLoaderOptions = require('./vue-loader.config')
const isDev = process.env.NODE_ENV ==='development'
let config = {
    target:'web',
    entry:path.join(__dirname,'../client/client-entry.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'../public'),
        publicPath:'http://127.0.0.1:3000/public/'
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:[
                    {
                        loader:'vue-loader',
                        options:createVueLoaderOptions(isDev)
                    }
                ]
               
            },{
                test:/\.(gif|jpg|png|jpeg|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,//小于1024转换base64
                            name:'resources/[path][name].[hash].[ext]',

                        }
                    }
                ]
            },{
                test:/\.jsx$/,
                loader:'babel-loader'
            },{
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin()       
    ]
}


module.exports = config

const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
let config = {
    target:'web',
    entry:path.join(__dirname,'../client/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'../dist')
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
                            name:'resources/[path][name].[hash].[ext]',

                        }
                    }
                ]
            },{
                test:/\.jsx/,
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

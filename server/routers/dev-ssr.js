const Router = require('koa-router')
const axios = require('axios')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const VueServerRenderer = require('vue-server-renderer')

const serverConfig = require('../../build/webpack.config.server')
//生成bundle文件 用于服务端渲染
const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs()
//编译文件输出在内存
serverCompiler.outputFileSystem = mfs
//记录webpack每次打包生成文件
let bundle
serverCompiler.watch({},(err,stats)=>{
    if(err) throw err
    stats = stats.toJson()
    stats.errors.forEach(err=>console.log(err))
    stats.warning.forEach(warn=>console.log(warn))

    const bundlePath  = path.join(
        serverConfig.output.path,
        'vue-ssr-server-bundle.json'
    )
    //读取内存中的bundle
    bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
    
   

})
//处理服务端渲染
const handleSSR = async (ctx)=>{
    //当服务启动时，bundle还没有打包好
    if(!bundle){
        ctx.body ='加载中...'
        return
    }
    //获取客户端资源文件
    const clientManifestResp = await axios.get(
        'http://127.0.0.1:3000/vue-ssr-client-manifest.json'
    )
    const clientManifest = clientManifestResp.data
   //获取模板文件
    const template = fs.readFileSync(
        path.join(__dirname,'../server.template.ejs')
    )
    //生成bundlerenderer对象-
    const renderer = VueServerRenderer
    .createBundleRenderer(bundle,{
        inject:false,
        clientManifest

    })

}
const router = new Router()
router.get(/\.*/, handleSSR)

module.exports = router

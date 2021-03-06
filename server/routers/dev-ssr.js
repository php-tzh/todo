const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')//服务端渲染

const serverRender = require('../routers/server-render')
const serverConfig = require('../../build/webpack.config.server')//引入配置文件

const serverCompiler = webpack(serverConfig)//编译webpack
const mfs = new MemoryFS()//将文件写到内存对象
serverCompiler.outputFileSystem = mfs//将文件输出到内存对象

let bundle //记录webpack每次打包生成的文件
serverCompiler.watch({}, (err, stats) => {
  //在client目录修改时重新打包
  if (err) throw err
  //其他错误解决
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(warn))

  //读取bundle文件
  const bundlePath = path.join(
    serverConfig.output.path,
    //vue-server-renderer/server-plugin生成的json文件
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))//二进制转换字符串读取
  console.log('new bundle generated')
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
        'http://127.0.0.1:3000/public/vue-ssr-client-manifest.json'
    )
    const clientManifest = clientManifestResp.data
   //获取模板文件
    const template = fs.readFileSync(
        path.join(__dirname,'../server.template.ejs'),'utf-8'
    )
    //生成bundlerenderer对象-
    const renderer = VueServerRenderer
    .createBundleRenderer(bundle,{
        inject:false,
        clientManifest

    })

    //html渲染
    await serverRender(ctx,renderer,template)

}
const router = new Router()
router.get(/\.*/, handleSSR)

module.exports = router

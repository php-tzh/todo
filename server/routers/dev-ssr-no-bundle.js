const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render-no-bundle')
const serverConfig = require('../../build/webpack.config.server')

const NativeModule = require('module')
const vm = require('vm')

const serverCompiler = webpack(serverConfig)
// const mfs = new MemoryFS()
// serverCompiler.outputFileSystem = mfs

let bundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  const bundlePath = path.join(
    serverConfig.output.path,
    'server-entry.js'//render方式直接读取 js文件 ，bundlerender参考 dev-ssr
  )
  delete require.cache[bundlePath] //防止缓存
  bundle = require('../../server-build/server-entry.js').default
  // function (module, exports, require)
  // try {
  //   const m = { exports: {} }//声明一个模块
  //   const bundleStr = mfs.readFileSync(bundlePath, 'utf-8')//读取bundleStr
  //   //使读取的js文件变成一个可用的模块
  //   //1.用模块封装bundleStr
  //   //
  //   const wrapper = NativeModule.wrap(bundleStr)
  //   //2.new 一段js可以执行的内容 得到一个可以执行的js代码
  //   const script = new vm.Script(wrapper, {
  //     filename: 'server-entry.js',
  //     displayErrors: true //是否显示错误
  //   })
  //   //3.script运行的时候需要一个上下文。这个上下文包含 moduel，exports ,require全局公共变量
  //   const result = script.runInThisContext()
  //   //4.调用模块
  //   result.call(m.exports, m.exports, require, m)
  //   bundle = m.exports.default
  // } catch (err) {
  //   console.error('compile js error:', err)
  // }
  console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }

  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  const renderer = VueServerRenderer
    .createRenderer({
      inject: false,
      clientManifest
    })

  await serverRender(ctx, renderer, template, bundle)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router

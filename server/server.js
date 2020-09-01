const Koa = require('koa')
const path = require('path')

const app = new Koa()

const staticRouter = require('./routers/static')
const apiRouter = require('./routers/api')
const Router = require('koa-router');
const send = require('koa-send');
const koaSession = require('koa-session')
const koaBody = require('koa-body')
const createDb = require('./db/db')
const config =  require('../app.config')
const userRouter = require('./routers/user')

const db = createDb(config.db.appId,config.db.appKey) 
//post
app.use(koaBody())
//数据库操作中间件
app.use(async (ctx,next)=>{
    ctx.db = db
    await next()
})
app.use(userRouter.routes()).use(userRouter.allowedMethods()) 
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
const isDev = process.env.NODE_ENV === 'development'
let router = new Router()
//session
app.keys = ['vue','ssr','abs']
app.use(koaSession({
    key:'vue-ssr-id',
    maxAge:2*60*60*1000
},app))
//全局异常处理
app.use(async (ctx,next)=>{
    try{
       
        console.log(`request with path ${ctx.path}`);
        await next()
    } catch (err){
        console.log(err);
        ctx.status = 500
        if(isDev){
            ctx.body = err.message

        }else{
            ctx.body = '请再次尝试'
        }
    }
})
// favicon.ico 处理
app.use(async (ctx,next)=>{
    if(ctx.path==='/favicon.ico'){
      await  send(ctx,'/favicon.ico',{root:path.join(__dirname,'../')})
    }else{
        await next()
    }
})
//静态资源
staticRouter(router,{
    html:365
});

app.use(router.routes())
let pageRouter
if(isDev){
   pageRouter = require('./routers/dev-ssr')

}else{
   pageRouter = require('./routers/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '8081'
app.listen(PORT,HOST,()=>{
    console.log(`server is run in ${HOST}:${PORT}`)
}) 

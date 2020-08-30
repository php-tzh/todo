const Koa = require('koa')

const app = new Koa()
const pageRouter = require('./routers/dev-ssr')

const isDev = process.env.NODE_ENV === 'development'

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

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '8081'
app.listen(PORT,HOST,()=>{
    console.log(`server is run in ${HOST}:${PORT}`)
})

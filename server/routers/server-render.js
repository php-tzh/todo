const ejs = require('ejs')
module.exports = async (ctx,renderer,template)=>{
    ctx.headers['Content-Type'] = 'text/html'
    const context = {url:ctx.path}
    try{
        const appString = await renderer.renderToString(context)
        //处理redirect
        //  if(ctx.router.currentRoute.fullPath !== ctx.path){
        //     return ctx.redirect(ctx.router.currentRoute.fullPath )
        //  }
        const {title} = context.meta.inject()//title元信息
        const html = ejs.render(template,{
            appString,
            style:context.renderStyles(),
            scripts:context.renderScripts(),
            title:title.text(),
            initalState:context.renderState() //获取store里面的state
        })
        ctx.body = html

    }catch(err){
        console.log(err);
        throw err
    }
    
     
}
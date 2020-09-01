const Router = require('koa-router')

const userRouter = new Router({ prefix: '/user' })

userRouter.post('/login', async ctx => {
  const user = ctx.request.body
//   return console.log(ctx.request.body);
  if (user.username === 'tzh' && user.password === '123') {
    if(ctx.session.user){
      return  console.log(ctx.session.user,'hello');
    }
    // return
    ctx.session.user = {
      username: 'tzh'
    }
    // console.log(ctx.session.user);
    // console.log('h');
    ctx.body = {
      success: true,
      data: {
        username: 'tzh'
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'username or password error'
    }
  }
})

module.exports = userRouter

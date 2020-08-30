import Router from 'vue-router'

import routes from './routes'

//服务端渲染写法
export default ()=>{
    return new Router({
        routes
    })
}
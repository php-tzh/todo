import createApp from './create-app'
import bus from './util/bus'
const {app,router,store} = createApp()
//服务端渲染后template 生成window.lINITAL_STATE_
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
//监听未登录
// bus.$on('auth',()=>{
//     router.push('/login')
// })
router.onReady(()=>{
    app.$mount('#app')
})

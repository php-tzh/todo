import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import createRouter from './config/router'

Vue.use(VueRouter)
const router = createRouter()
import './assets/styles/global.styl'
new Vue({
    router,
    render:(h)=>h(App)
}).$mount('#app')
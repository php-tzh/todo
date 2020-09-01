import Notification from './notification.vue'
import notify from './func'
export default (Vue)=>{
    Vue.component(Notification.name,Notification)
    Vue.prototype.$notify = notify
}
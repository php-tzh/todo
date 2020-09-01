import Component from './func-notification'
import Vue from 'vue'
const NotificationConstructor = Vue.extend(Component)

const instances = []
let seed = 1
const removeInstance =(instance) =>{
    if(!instance) return
    const len = instances.length
    const index = instances.findIndex(inst=>instance.id === inst.id)

    instances.splice(index,1)
    if(len <=1 )return//最后一个节点直接return
    const removeHeight = instance.vm.height
    for (let i = index; i < len - 1; i++) {
        instances[i].verticalOffset =
        parseInt(instances[i].verticalOffset) - removeHeight - 16
    }
    
}
const notify = (options)=>{
    if(Vue.prototype.$isServer)return
    const  {autoClose,...rest} = options
    const instance = new NotificationConstructor({
        propsData:{
            ...rest
        },
        data:{
            autoClose:autoClose?autoClose : 3000
        }
    })
    const id = `notification_${seed++}`//每个通知唯一id
    instance.id = id
    instance.vm = instance.$mount()// el 挂载到html 
    
    document.body.appendChild(instance.vm.$el)
    instance.vm.visible = true//dom节点插入之后才进行显示 ，方便监听afterEnter

    let verticalOffset = 0  //默认右下角

    instances.forEach((item,i)=>{
        verticalOffset += item.$el.offsetHeight + 16
    })
    verticalOffset += 16
    instance.verticalOffset = verticalOffset
    instances.push(instance)
    //被动消失
    instance.vm.$on('closed',()=>{
        removeInstance(instance)//删除数组的通知
        document.body.removeChild(instance.vm.$el)//删除节点
        instance.vm.$destroy()//删除vm对象

    })

    //主动点击  //触发closed
    instance.vm.$on('close',()=>{
        instance.vm.visible= false

    })  
    return instance.vm


}
export default  notify
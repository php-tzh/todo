<template>
  <section class="real-app">
    
    <div class="tab-container">
      <tabs :value="filter" @change="handleChangeTab">
        <tab :label="tab" :index="tab" v-for="tab in states" :key="tab" />
    
      </tabs>
    </div>
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="handleAdd"
    >
    <Helper @del="deleteTodo" @toggle="toggleState" :todo="todo" v-for="todo in filteredTodos" :key="todo.id" ></Helper>
    <!-- <Tabs :filter="filter" :todos="todos" @toggle="toggleFilter" @clearAll="clearAllCompleted"></Tabs> -->
  </section>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import Helper from './item.vue'
// import Tabs from './tabs.vue'
export default {
  metaInfo:{
    title:"这是tudo"
  },
  data(){
    return  {
      filter:'all',
      // tabValue:'all',
      inputvalue:0,
      states:['all','active','completed']
    }   
  },
  components:{
    Helper
  },
  mounted(){
    //服务端客户公用数据，如果服务端获取到数据后，客户端不在请求
    if(this.todos && this.todos.length<1){
       this.fetchTodos()
    }
   
  },
  //服务端渲染获取数据
  asyncData({store}){
    return store.dispatch('fetchTodos')
    // return Promise.resolve('hello')
    // if(store.state.user){
    // return store.dispatch('fetchTodos')

    // }
    // router.replace('/login')
    // return Promise.revolve()

  },
  methods:{
    ...mapActions(['fetchTodos','addTodo','deleteTodo','updateTodo','deleteAllCompleted']),
    handleAdd(e){
        const content = e.target.value.trim()
        if(!content){
          return this.$notify({
            content:'必须输入'
          })
        }
        const todo = {
          content,
          completed:false
        }
        this.addTodo(todo)
        e.target.value=''
    },

   
    clearAllCompleted(){
      // this.todos = this.todos.filter(todo=>!todo.completed)
      this.deleteAllCompleted()
    },
    handleChangeTab(value){
      // this.tabValue = index
      this.filter = value
    },
    toggleState(todo){
      this.updateTodo({
        id:todo.id,
        todo:Object.assign({},todo,{
          completed:!todo.completed
        })
      })
    }
  },
  computed:{
    ...mapState(['todos']),
    filteredTodos(){
      if(this.filter=='all'){
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo=>completed===todo.completed)
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app{
  width 600px
  margin 0 auto
  box-shadow 0 0 5px #666
}
.add-input{
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
}
.tab-container
  background-color #fff
  padding 0 15px
</style>



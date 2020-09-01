<script  type="text/jsx">
import TabContainer from './tab-container.vue'

export default {
  name: 'Tabs',
  components: {
    TabContainer
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      panes: []
    }
  },
  render () {
    const contents = this.panes.map(pane=>{
      return pane.active ? pane.$slots.default:null
    })
    return (
      <div class='tabs'>
        <ul class='tabs-header'>
          {this.$slots.default}
        </ul>
       
        <div class="tab-content">
          {contents}
        </div>
       
        {/**  <tab-container panes={this.panes}></tab-container> */}

      </div>
    )
  },
  methods: {
    onChange (index) {
      this.$emit('change', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
.tabs-header
  display flex
  list-style none
  margin 0
  padding 0
  border-bottom 2px solid #ededed
</style>

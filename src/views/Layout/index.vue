<template>
  <div :class="[menuStatus ? 'close' : 'open']">
      <LayoutHeader />
      <LayoutMain />
      <LayoutNav />
  </div>
</template>

<script>
import LayoutHeader from './Component/Header.vue'
import LayoutMain from './Component/Main.vue'
import LayoutNav from './Component/Nav.vue'
import { onMounted, reactive, ref ,computed} from "@vue/composition-api";

export default {
  name: 'layout',
  components: {
      LayoutHeader,
      LayoutMain,
      LayoutNav
  },
  setup(props,{root}){
    const menuStatus = computed(()=> root.$store.state.app.isCollapse)

    return {
      menuStatus
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

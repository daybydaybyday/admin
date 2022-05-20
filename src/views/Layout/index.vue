<template>
  <div class=''>
      <LayoutHeader />
      <LayoutMain />
      <LayoutNav />
  </div>
</template>

<script>
import LayoutHeader from './Component/Header.vue'
import LayoutMain from './Component/Main.vue'
import LayoutNav from './Component/Nav.vue'

export default {
  name: 'layout',
  components: {
      LayoutHeader,
      LayoutMain,
      LayoutNav
  },
  setup(){

  }
}
</script>
<style lang='scss' scoped>
</style>

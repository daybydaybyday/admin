<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
      <!-- 跳转的子级路由会在这里展示 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "",
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
#main-wrap{
  height: 100vh;
}
 .main-content {
  height: 100vh;
  height: 100%;
  padding-top: $headerMenu + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.content {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
}
</style>

<template>
  <div id="nav-wrap">
    <img src="@/assets/images/logo.png" alt="" />
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#344a5f"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!-- 根据组件库的定义 router属性可以实现路由的跳转 -->
      <!--template标签不会被解析 v-for 与 v-if 最好不出现在同一个标签，但又想条件遍历标签 用templete
      注意 v-foe的key值不能放入template标签  上下配合使用 -->
      <template v-for="(item, index) in routes">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" className="menu"></svg-icon>
            <span slot="title">{{ item.meta.name }}</span>
          </template>

          <el-menu-item
            v-for="(subItem, index) in item.children"
            :key="subItem.id"
            :index="subItem.path"
            >{{ subItem.meta.name }}</el-menu-item
          >
          <!-- 遍历每一个item中的subItem  跳转的路由用index绑定 -->
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { onMounted, reactive, ref, computed } from "@vue/composition-api";
export default {
  name: "",
  setup(props, { root }) {
    //数据
    const routes = reactive(root.$router.options.routes);

    //函数
    const isCollapse = computed(() => root.$store.state.app.isCollapse);

    return {
      isCollapse,
      routes,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, 0.3s ease 0s);
  svg {
    font-size: 18px;
    margin-right: 26px;
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMix;
    img {
      margin: auto;
      width: 38px;
      margin-top: 28px;
      margin-bottom: 25px;
    }
  }
}
li {
  text-align: left !important;
}

img {
  margin: auto;
  width: 92px;
  margin-top: 28px;
  margin-bottom: 25px;
}
</style>

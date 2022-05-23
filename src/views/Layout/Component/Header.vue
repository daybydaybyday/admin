<template>
  <div id="header-wrap">
      <div class="pull-left header-icon" @click="navMenuState">
        <svg-icon iconClass="menu" className="menu"></svg-icon>
      </div>

      <div class="pull-right">
        <div class="user-info pull-left">
          <img src="@/assets/images/face.png" alt="" >
          <p class="pull-left">{{username}}</p>
        </div>
        <div class="header-icon pull-left"  @click="exit">
          <svg-icon iconClass="exit" className="exit"></svg-icon>
        </div>
      </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
export default {
  name: '',
  setup(props,{root}){
    const username=computed(()=>{
      root.$store.state.app.username
    })
    const navMenuState = ()=> {
      root.$store.commit('app/SET_COLLAPSE')
      //root.$store.dispatch('setMenuStatus',{"name":"aaa"})
    }
    const exit = ()=>{
        root.$store.dispatch('app/exit').then(()=>{
          root.$router.push({
            name:'Login'
          })
        })
    }

    return{
      navMenuState,
      username,
      exit
    }
  }
}
</script>
<style lang='scss' scoped>
@import "@/styles/config.scss";
#header-wrap{
  position: fixed;
  top: 0;
  right: 0;
  left :$navMenu;
  height: $headerMenu;
  line-height: $headerMenu;
  background-color: #fff;
  @include webkit(transition,.3s ease 0s);
  -webkit-box-shadow: 0 3px 16px 16px rgba(0,0,0,.1)
}
.open{
  #header-wrap{
    left :$navMenu;
  }
}
.close{
  #header-wrap{
    left :$navMenuMix;
  }
}
.header-icon{
  padding:  0 32px;
  svg{
    font-size :25px;
    margin-bottom: -8px;
    cursor: pointer;
    }
}
.user-info{
    height: 100%;
    padding: 0 32px;
    border-right: 1px solid #ededed;
    
  }

img{
  width:30px;
  height: 30px;
  border-radius: 100%;
  float: left;
  margin-top:22px;
  margin-right: 10px;
}
</style>
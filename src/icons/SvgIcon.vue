<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { onMounted, reactive, ref , computed } from "@vue/composition-api";
export default {
  name: 'svgIcon',
  //props: ['iconClass','className'],
  props:{
      iconClass:{
          //分页
          type: String,
          default: ''
      },
      className:{
          type: String,
          default:''
      }  
  },
  setup(props){

      const iconName = computed(()=>{
          return `#icon-${props.iconClass}`
      })

      const svgClass = computed(()=>{
          if(props.className){
              return `svg-icon ${props.className}`
          }else{
              return `svg-icon`
          }
      })

      return{
        iconName,
        svgClass
      }
  }
}
</script>
<style lang='scss' scoped>
.svg-icon{
    width:1em;
    height:1em;
    font-size: 20px;
    fill:currentColor;
}
</style>
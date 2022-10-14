const state = {
    id:""||JSON.parse(sessionStorage.getItem('infoId')) ,
    title:""||JSON.parse(sessionStorage.getItem('infoTitle'))
}
const getters = {
    infoId : state => state.id,
    infoTitle: state => state.title
}
const mutations = { // 必须的 同步  不需要回调函数
    SET_ID(state,value){
        state.id = value
        sessionStorage.setItem('infoId', value)
    },
    SET_TITLE(state,value){
        state.title = value
        sessionStorage.setItem('infoTitle', value)
    }
}
const actions = {

} //可以回调处理事情  同步异步都可进行


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
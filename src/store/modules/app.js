import Cookie from 'cookie_js'
import {
    Login
} from "@/api/login";
import {
    setToken,
    setUserName,
    getUserName,
    removeToken,
    removeUserName
} from '@/utils/app';

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    toKen: '',
    username: getUserName || ''
}

const getters = {
    isCollapse: state => state.isCollapse,
    username: state => state.username
}

const mutations = {
    // 必须的 同步  不需要回调函数
    SET_COLLAPSE: (state) => {
        state.isCollapse = !state.isCollapse
        //此处为临时性文件
        //Cookie.set('isCollapse',JSON.stringify(state.isCollapse))
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
    }, //sessionStorage 关闭浏览器时清除存储  localStorage长期存储 需要手动清除
    //交互小时推荐sessionStorage，存储临时文件
    //程序要求在请求头携带cookie时
    //根据业务需求选择三者之一
    SET_TOKEN(state, value) {
        state.toKen = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    },
    REMOVE_TOKEN(state) {
        state.toKen = ''
    },
}

const actions = {
    setMenuStatus(content, data) {
        //可以将content解构
        // content.state
        // content.getters
        // content.commit
        // content.rootGetters
        //可以修改mutation中的内容 content.commit('SET_COLLAPSE')


        //异步，请求接口返回数据后，接着去做别的事情
    },
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            //接口  
            Login(requestData).then((response) => {
                let data = response.data.data
                content.commit('SET_TOKEN', data.toKen)
                content.commit('SET_USERNAME', data.username)
                setToken(data.token)
                setUserName(data.username)
                resolve(response) //注意要返回信息
            }).catch(error => {
                reject(error)
            })
        })
    },
    exit(content) {
        return new Promise((resolve, reject) => {
            removeToken()
            removeUserName()
            content.commit('SET-TOKEN', '')
            content.commit('SET-USERNAME', '')
            resolve()
        })
    }
}

// const app = {
//     state: {
//         //JSON.parse  字符串转换为对象  注意：key和value要用双引号引起来
//         // JSON.stringify 转换为字符串 
//         //isCollapse: JSON.parse(Cookie.get('isCollapse')) || false 
//         isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
//     },
//     getters: {},
//     mutations: { // 必须的 同步  不需要回调函数
//         SET_COLLAPSE: (state) => {
//             state.isCollapse = !state.isCollapse
//             //此处为临时性文件
//             //Cookie.set('isCollapse',JSON.stringify(state.isCollapse))
//             sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
//         } //sessionStorage 关闭浏览器时清除存储  localStorage长期存储 需要手动清除
//         //交互小时推荐sessionStorage，存储临时文件
//         //程序要求在请求头携带cookie时
//         //根据业务需求选择三者之一
//     },
//     actions: { //可以回调处理事情  同步异步都可进行
//         setMenuStatus(content, data) {
//             //可以将content解构
//             // content.state
//             // content.getters
//             // content.commit
//             // content.rootGetters
//             //可以修改mutation中的内容 content.commit('SET_COLLAPSE')


//             //异步，请求接口返回数据后，接着去做别的事情
//         },
//         login(content, requestData) {
//             return new Promise((resolve, reject) => {
//                 //接口  
//                 Login(requestData).then((response) => {
//                     resolve(response) //注意要返回信息
//                 }).catch(error => {
//                     reject(error)
//                 })
//             })
//         }
//     }
// }

//export default app;
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
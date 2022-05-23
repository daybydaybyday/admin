import router from "./index";
import {getToken ,removeToken, removeUserName} from '@/utils/app'
import store from '@/store/index'

const whiteRouter = ['/login'];//白名单
//indexOf方法，判断是否存在指定的某个对象

router.beforeEach((to, from, next) => {
    if(getToken()){
        //存在token

        //路由动态添加 ，分配菜单 ，每个角色分配不同的菜单
        

        //1.to=/console
        //2.to=/index 重定向

        //退出时清除cookie，避免后续再直接进入
        if(to.path==='/login'){
            removeToken();
            removeUserName()
            store.commit("app/SET_TOKEN")
            store.commit("app/SET_USERNAME")
            next();
        }else{
            next();
        }

    }else{
        //不存在token

        //next('/login')
        //不可以这样写  这样写一定会造成死循环  每次路由跳转都会跳到路由守卫这里来
        
        if(whiteRouter.indexOf(to.path) !== -1){
            next();
        }else{
            next('./login') //路由指向
        }

    }
    //直接进入index时，路由指向index，没有token，没在白名单，跳入login
    //再次进入路由守卫，to指向login，在白名单里，发生跳转
})
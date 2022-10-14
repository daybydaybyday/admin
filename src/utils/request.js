//拦截器
import axios from 'axios'
import { Message } from 'element-ui';
import {getToken,getUserName} from './app'

//创建axios，赋给变量instance

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'//输出文件的目录
const service = axios.create({
  baseURL: BASEURL,//http://172.16.49.91:8080==http://old.web-jshtml.cn/vue_admin_api
  timeout: 10000//设置偏长一点，因为网络请求需要一定的时间
});

service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //后台需要前端传相关的参数（在请求头添加参数）
    //Tokey
    //userId
    //sui

    //业务需求


    //最终目的是在请求头参加参数
    config.headers['Tokey']= getToken()
    config.headers['UserName']= getUserName()

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //服务器端做的
    let data = response.data

    if(data.resCode !== 0 ){
      Message.error(data.message)
      return Promise.reject(data);
    }else{//正常的情况下rescode为0（和后端沟通好状态标识）
      return response
      //return Promise.resolve(data)
    }
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });


export default service;
//default只能有一个
//不是default，引用就可以用{}，因为可以暴漏多个，用逗号隔开就好
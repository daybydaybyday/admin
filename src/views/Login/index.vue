<template>
  <div id="Login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
        <!-- 循环遍历输出数组中的数据 -->
        <!-- isActive为true，绑定current ,可以判断多个-->
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          size="medium"
        >
          <el-form-item prop="username" class="item-from">
            <!-- id与for配合，实现点击字input框获得焦点 -->
            <label for="username">邮箱</label>
            <el-input
              id="username"
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password" class="item-from">
            <label for="password">密码</label>
            <el-input
              id="password"
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              minlength="6"
              maxlength="20"
            ></el-input>
          </el-form-item>

          <el-form-item
            prop="passwords"
            class="item-from"
            v-show="model === 'register'"
          >
            <!-- if会直接删除元素，show只是隐藏属性 
          此处用if 会删除元素 提交时不会再对其进行判断 
          如果用show则需继续加验证
          但考略渲染速度和性能，选择show更佳-->
            <label for="password1">重复密码</label>
            <el-input
              id="password1"
              type="password"
              v-model="ruleForm.passwords"
              autocomplete="off"
              minlength="6"
              maxlength="20"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code" class="item-from">
            <label for="code">验证码</label>
            <el-row :gutter="10">
              <el-col :span="14"
                ><el-input id="code" v-model="ruleForm.code"></el-input
              ></el-col>
              <el-col :span="10">
                <el-button
                  type="success"
                  class="block"
                  @click="getSms()"
                  :disabled="codeButtonStatus.status"
                  >{{ codeButtonStatus.text }}</el-button
                ></el-col
              >
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button
              type="danger"
              @click="submitForm('ruleForm')"
              class="login-btn block"
              :disabled="loginButtonStatus"
              >{{ model == "login" ? "登录" : "注册" }}</el-button
            >
          </el-form-item>
        </el-form>
      </ul>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import { GetSms, Register ,Login } from "@/api/login";
import { onMounted, reactive, ref } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode,
} from "@/utils/validate";
export default {
  name: "Login",
  setup(props, context) {
    //一次性引入context可能会造成资源浪费，我们可以解构单独引入：{refs,root,...}
    //(props,{refs}),此时直接使用结构出的refs，不用context.refs
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };

    //验证密码
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6-20位的数字+字母"));
      } else {
        callback();
      }
    };

    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //login模块不用验证重复密码
      if (model.value === "login") {
        callback();
      }
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        //只需要验证两次密码是否一致
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };

    //验证验证码
    var validateCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" },
    ]);

    //模块值
    const model = ref("login");

    //登录注册按钮禁用状态
    const loginButtonStatus = ref(true);

    //倒计时
    const timer = ref(null);

    // //获取验证码按钮禁用状态
    // const codeButtonStatus = ref(false);
    // //获取验证码按钮的文字
    // const codeButtonText=ref('获取验证码');

    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码",
    });

    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: "",
    });
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    const toggleMenu = (item) => {
      menuTab.forEach((e) => {
        e.current = false;
      });
      //高光切换
      item.current = !item.current; 
      //修改模块值
      model.value = item.type;
      //重置表单
      context.refs["ruleForm"].resetFields();
      clearCountDown();//倒计时按钮的改变
      loginButtonStatus.value=true;
    };

    //提交表单
    const submitForm = (formName) => {
      context.refs[formName].validate((valid) => {
        if (valid) {
          if(model.value=='login'){
              login()
          }else{
              register()
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    //获取验证码
    const getSms = () => {
      //进行提示  前端做的, 前端和服务端都验证更加保险
      if (ruleForm.username == "") {
        context.root.$message.error("邮箱不能为空!");
        //root相当于this
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        context.root.$message.error("邮箱格式有误,请重新输入!");
        return false;
      }
      //修改按钮状态
      codeButtonStatus.status = true;

      codeButtonStatus.text = "发送中";

      setTimeout(() => {
        //请求接口
        GetSms({ username: ruleForm.username, module: model.value })
          .then((response) => {
            let data = response.data;
            context.root.$message({
              message: data.message,
              type: "success",
            });
            //启动登录注册按钮
            loginButtonStatus.value = false;
            //请求成功后，开启定时器
            countDown(60);
          })
          .then((error) => {});
      }, 2000);
    };

    //倒计时函数
    const countDown = (number) => {
      //没有60和0，测试方面的事情
      //setTimeout  只执行依次
      //setInterval 不断的执行，需要条件才会停止
      //判断定时器是否存在，存在则删除，否则一直启动的是原来的定时器
      if(timer.value){clearInterval(timer.value)}
      let time = number;
      timer.value = setInterval(() => {
        time--;
        codeButtonStatus.text = `倒计时${time}秒`;
        if (time === 0) {
          clearInterval(timer.value); //清除定时器
          codeButtonStatus.status = false;
          codeButtonStatus.text = "重新发送";
        }
      }, 1000);
    };

    //清除倒计时
    const clearCountDown = (()=>{
      //还原验证码按钮的状态
      codeButtonStatus.status=false;//可以发送验证码
      codeButtonStatus.text='获取验证码'
      //清除倒计时
      clearInterval(timer.value)
    })

    //登录
    const login = (()=>{
      let requestData = {
            username: ruleForm.username,
            password: sha1(ruleForm.password),//前端加密，但效果不行  后端必须加密
            code: ruleForm.code,
            module: "login",
          };
          context.root.$store.dispatch('app/login',requestData).then((response) => {
            let data = response.data;
            //路由跳转
             context.root.$router.push({
               name:'Console'
             })
            console.log(data)
          }).catch(error=>{
            //失败时执行的代码
          })
          //登录接口
          // Login(requestData).then((response) => {
          //   let data = response.data;
          //   //路由跳转
          //    context.root.$router.push({
          //      name:'Console'
          //    })
          //   console.log(data)
          // }).catch(error=>{
          //   //失败时执行的代码
          // })
    })

    //注册
    const register = (()=>{
      let requestData = {
            username: ruleForm.username,
            password: sha1(ruleForm.password),
            code: ruleForm.code,
            module: "register",
          };
          //注册接口
          Register(requestData).then((response) => {
            let data = response.data;
            context.root.$message({
              message: data.message,
              type: "success",
            });
            toggleMenu(menuTab[0])
          }).catch(error=>{
            //失败时执行的代码
          })
    })

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms,
      loginButtonStatus,
      codeButtonStatus,
      //返回在视图层用得到的
    };
  },
};
</script>
<style lang="scss" scoped>
#Login {
  height: 100vh; //基于可视区来处理
  background-color: #344a5f;
}

.login-wrap {
  width: 330px;
  margin: auto;
}

.menu-tab {
  li {
    text-align: center;
    display: inline-block;
    width: 88px;
    height: 36px;
    line-height: 36px; //垂直居中
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.demo-ruleForm {
  margin-top: 29px;

  label {
    margin-bottom: 3px;
    display: block;
    text-align: left;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
    text-align: center;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>


<!-- 密码加密
1 在前端预先加密一次  sha1('密码')

2  后台加密
接收到前端发送来的加密字符串
后台再次加密  md5('加密字符串)
将最终的字符串写入数据库

3.登录
  用户名与登陆后的密码进行匹配，成功登录 失败提醒
 -->

 <!-- 不建议在一个方法里做多个不同的事情 -->

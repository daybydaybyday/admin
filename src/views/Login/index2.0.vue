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
            <label>邮箱</label>
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password" class="item-from">
            <label>密码</label>
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              minlength="6"
              maxlength="20"
            ></el-input>
          </el-form-item>

          <el-form-item prop="passwords" class="item-from" v-show = " model === 'register'">
          <!-- if会直接删除元素，show只是隐藏属性 
          此处用if 会删除元素 提交时不会再对其进行判断 
          如果用show则需继续加验证
          但考略渲染速度和性能，选择show更佳-->
            <label>重复密码</label>
            <el-input
              type="password"
              v-model="ruleForm.passwords"
              autocomplete="off"
              minlength="6"
              maxlength="20"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code" class="item-from">
            <label>验证码</label>
            <el-row :gutter="10">
              <el-col :span="14"
                ><el-input v-model.number="ruleForm.code"></el-input
              ></el-col>
              <el-col :span="10">
                <el-button type="success" class="block"
                  >获取验证码</el-button
                 ></el-col
              >
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button
              type="danger"
              @click="submitForm('ruleForm')"
              class="login-btn block"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </ul>
    </div>
  </div>
</template>

<script>
import {stripscript,validateEmail,validatePass,validateVCode} from "@/utils/validate"
export default {
  name: "Login",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    //验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if(validateEmail(value)){
          callback(new Error("用户名格式有误"));
      }else{
          callback();
      }
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password=stripscript(value);
      value=this.ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6-20位的数字+字母"));
      } else {
        callback();
      }
    };

    //验证重复密码
    var validatePasswords = (rule, value, callback) => {
      //login模块不用验证重复密码
      if(this.model === 'login'){
        callback();
      }
      this.ruleForm.passwords=stripscript(value);
      value=this.ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value!=this.ruleForm.password) {
        //只需要验证两次密码是否一致
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };

    //验证验证码
    var validateCode = (rule, value, callback) => {
      this.ruleForm.code=stripscript(value);
      value=this.ruleForm.code;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    
    return {
      menuTab: [
        { txt: "登录", current: true ,type:'login'},
        { txt: "注册", current: false ,type:'register'},
      ],
      //模块值
      model:"login",
      ruleForm: {
        username: "",
        password: "",
        passwords: "",
        code: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePasswords, trigger: "blur" }],
        code: [{ validator: validateCode , trigger: "blur" }],
      },
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    //数据驱动视图-》vue

    toggleMenu(item) {
      this.menuTab.forEach((e) => {
        e.current = false;
      });
      item.current = !item.current; //高光切换
      //修改模块值
      this.model=item.type
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    
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

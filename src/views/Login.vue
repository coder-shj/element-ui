<template>
  <div class="login_container">
    <div class="big_box">
      <img src="~assets/logo.png" alt="" style="width: 440px">
      <div class="login_box">
        <h2>专升本信息管理系统</h2>
        <!-- 登录表单区域 -->
        <el-form class="login_from" ref="loginFormRef" :rules="loginFormRules" :model="loginForm">
          <el-form-item class="text" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item class="text" prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" id="regin" @click="Register">注册</el-button>
          </el-form-item>
          <box id="find">
            <el-link type="info" @click="FindPsw">找回密码</el-link>
          </box>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        // 这是登录表单的数据绑定对象
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        // 这是表单的验证规则对象
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      Register() {
        this.$router.push('/register')
      },
      FindPsw() {
        this.$router.push('/findpassword')
      },
      login() {
        this.$refs.loginFormRef.validate((valid, res) => {
          if(!valid) return;

          
          // 在此处发送网络请求

          this.$http.post("login", this.loginForm).then(res => {
            if(res.data.meta.status !== 200) return this.$message.error('登录失败');
            this.$message.success('登录成功');
            // 1、登录成功之后的 token ，保存到客户的 sessionStorage 中
            //   1.1、项目中出了登录之外的其他API接口，必须在登陆后才能访问
            //   2.2、token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
            // console.log(res);
            // console.log(res.data.data.token);
            window.sessionStorage.setItem("token", res.data.data.token)
            // 2、通过编程时导航跳转到后台主页，路由地址是 /home
            this.$router.push('/home')
          })
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #024153;
    overflow: hidden;
    height: 100%;
  }
  h2 {
    text-align: center;
  }
  .big_box {
    width: 750px;
    height: 450px;
    margin: 160px auto;
    background-color: #99BDC9;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #B2CFD7;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .btns {
    margin-left: 100px;
  }
  .login_from {
    position: absolute;
    width: 85%;
    box-sizing: border-box;
    padding: 0 20px;
    bottom: 0;
  }
  #regin {
    position: relative;
    left: 50px;
  }
  #find {
    position: relative;
    bottom: 48px;
    left: 348px;
  }
  .text {
    margin-left: 20%;
  }
</style>

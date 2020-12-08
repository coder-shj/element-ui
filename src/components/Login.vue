<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form class="login_from" ref="loginFormRef" :rules="loginFormRules" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
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
      resetLoginForm() {
        // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
        // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        this.$refs.loginFormRef.validate((valid, res) => {
          // console.log(valid);
          // console.log(res);
          if(!valid) return;
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
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_from {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    bottom: 0;
  }
</style>

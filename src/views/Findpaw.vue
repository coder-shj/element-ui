<template>
  <div class="Findpaw">
    <div class="box">
      <h1>'专升本'报名管理系统</h1>
      <h3>找回密码</h3>
      <p class="chao">
        <a href="http://www.hbpu.edu.cn/">湖北理工学员官网</a>
        <a @click="back">登录界面</a>
      </p>

      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="注册手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item class="yes">
          <el-button type="primary" @click="mibao">获取密保问题</el-button>
        </el-form-item>
      </el-form>

      <p>如果忘记密保问题，请联系管理员！</p>
      <p>联系电话：0714-65637896353</p>
      <p><a href="http://www.hbpu.edu.cn/">湖北理工学员官网</a>       Copyright 20016-2018 湖北理工学院(www.hbpu.edu.cn) 邮编：435003 电子邮件：wlzx@hbpu.edu.cn</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Findpaw",
    data() {
      return {
        ruleForm: {
          phone: ''
        },
        rules: {
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '长度为 11 个数字', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      mibao() {
        this.$refs.ruleForm.validate((valid, res) => {
          if(!valid) return;
          console.log(res);

          // 输入成功，在此处发送网络请求

          // this.$http.post("login", this.loginForm).then(res => {
          //   if(res.data.meta.status !== 200) return this.$message.error('登录失败');
          //   this.$message.success('登录成功');
          //   // 1、登录成功之后的 token ，保存到客户的 sessionStorage 中
          //   //   1.1、项目中出了登录之外的其他API接口，必须在登陆后才能访问
          //   //   2.2、token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
          //   // console.log(res);
          //   // console.log(res.data.data.token);
          //   window.sessionStorage.setItem("token", res.data.data.token)
          //   // 2、通过编程时导航跳转到后台主页，路由地址是 /home
          //   this.$router.push('/home')
          // })
        })
      }
    }
  };
</script>

<style lang="less" scoped>
.Findpaw{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #286778;
}
.box{
  width: 60%;
  border-radius: 20px;
  margin: 120px auto;
  background-color: #FEFFF1;
}
p,h1,h3,.chao{
  text-align: center;
}
a {
  padding-right: 30px;
  text-decoration: none;
  color: blue;
}
.demo-ruleForm{
  align-content: center;
  margin-left: 30%;
  width: 40%;
}
.yes{
  margin-left: 30%;
  margin-bottom: 250px;
}
</style>

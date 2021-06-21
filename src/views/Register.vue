<template>
  <div class="FindPsw">
    <div class="box">
      <h1>'专升本'报名管理系统</h1>
      <h3><span class="a1">注</span class="a2"><span>册</span></h3>
      <p class="chao">
        <a href="http://www.hbpu.edu.cn/">湖北理工学员官网</a>
        <a @click="back">登录界面</a>
      </p>
      <p class="text">
        欢迎注册湖北理工学院专升本账号<br>
        已有专升本账号  <a @click="back">立即登录</a><br>
        注册成功后可以登录专升本系统进行报名操作
      </p>
      
      <!-- 表单区域 -->
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="repsw">
          <el-input v-model="ruleForm.repsw"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id">
          <el-input v-model="ruleForm.id"></el-input>
        </el-form-item>
        <el-form-item label="安全邮箱" prop="emile">
          <el-input v-model="ruleForm.emile"></el-input>
        </el-form-item>

        <el-form-item label="密保问题一" prop="region1">
          <el-select v-model="ruleForm.quest1" placeholder="--请选择--">
            <el-option label="你的学号(工号)是" value="a"></el-option>
            <el-option label="你父亲的名字是" value="b"></el-option>
            <el-option label="你母亲的名字是" value="c"></el-option>
            <el-option label="你第一条狗的名字是" value="d"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="answer1">
          <el-input v-model="ruleForm.answer1"></el-input>
        </el-form-item>

        <el-form-item label="密保问题二" prop="region2">
          <el-select v-model="ruleForm.quest2" placeholder="--请选择--">
            <el-option label="你的学号(工号)是" value="a"></el-option>
            <el-option label="你父亲的名字是" value="b"></el-option>
            <el-option label="你母亲的名字是" value="c"></el-option>
            <el-option label="你第一条狗的名字是" value="d"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="answer2">
          <el-input v-model="ruleForm.answer2"></el-input>
        </el-form-item>

        <!-- <el-checkbox label="线下主题活动" name="type"></el-checkbox> -->

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleForm)">立即创建</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>



    </div>
  </div>
</template>

<script>
  export default {
    name: "FindPsw",
    data() {
      return {
        ruleForm: {
          phone: '',
          password: '',
          repsw: '',
          name: '',
          id:'',
          emile: '',
          quest1: '',
          quest2: '',
          answer1: '',
          answer1: ''
        },
        rules: {
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '长度为 11 个数字', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          repsw: [
            { required: true, message: '请在此输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { min: 18, max: 18, message: '长度为 18 个字符', trigger: 'blur' }
          ],
          emile: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          answer1: [
            { required: true, message: '请输入答案', trigger: 'blur' }
          ],
          answer2: [
            { required: true, message: '请输入答案', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      back() {
        this.$router.push('/login');
      },
      submitForm(form) {
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
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
      }
    }
  };
</script>

<style lang="less" scoped>
.FindPsw{
  width: 100%;
  height: 1500px;
  background-color: #286778;
}
.box{
  width: 50%;
  height: 100%;
  margin-left: 25%;
  background-color: white;
}
h1,h3{
  text-align: center;
}
h3{
  height:20px;
}
.a1{
  margin-right: 50px;
}
.chao{
  text-align: center;
}
a{
  padding-right: 20px;
  text-decoration: none;
  color: blue;
}
.text{
  text-align: center;
  font-size: 15px;
}
.demo-ruleForm{
  margin-left: 25%;
  width: 50%;
}
</style>

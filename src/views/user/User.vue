<template>
  <div class="User">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regemail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regemail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regmobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if(regmobile.test(value)){
        return callback()
      }
      callback(new Error('请输入合法手机号码'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      userList: [],
      // 数据总数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息保存
      editFrom: {},
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {required: true, message:'请输入用户名', trigger: 'blur'},
          {min: 3,
           max: 10,
           message:'用户的名称必须在3~10个字符之间',
           trigger: 'blur'}
        ],
        password: [
          {required: true, message:'请输入密码', trigger: 'blur'},
          {min: 6,
           max: 15,
           message:'用户的名称必须在6~15个字符之间',
           trigger: 'blur'}
        ],
        email: [
          {required: true, message:'请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message:'请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      // 修改表单的验证规则对象
      editFromRules: {
        email: [
          {required: true, message:'请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message:'请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http
        .get("users", {
          params: this.queryInfo,
        })
        .then((res) => {
          const data = res.data;
          if (data.meta.status !== 200)
            return this.$message.error("获取用户列表失败！");
          this.userList = data.data.users;
          this.total = data.data.total;
          // console.log(data.data);
        });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 监听 switch 开关监听状态的改变
    userStateChange(userinfo) {
      this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
        ).then(res => {
        if(res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败！')
        }
        return this.$message.success('更新用户状态成功。')
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      // 检测校验是否成功
      this.$refs.addFromRef.validate(valid => {
        if(!valid) return this.$message.error('请输入合法数据');
        // 发起添加新用户的网络请求
        this.$http.post('users', this.addForm).then(res => {
          console.log(res);
          if(res.data.meta.status !== 201){
            return this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false
          this.getUserList()
        })
      })
    },
    // 展示标记用户的对话框
    showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id);
      this.$http.get(`users/${id}`).then(res => {
        const data = res.data
        if(data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editFrom = data.data
        // console.log(this.editFrom);
      })
    },
    // 监听用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFromRef.validate(valid => {
        if(!valid) return;
        this.$http.put(`users/${this.editFrom.id}`, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        }).then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('更新用户失败')
          }
          this.$message.success('更新用户成功')
          this.getUserList()
          this.editDialogVisible = false
        })
      })
    },
    // 根据ID删除对应的用户信息
    removeUserById(id) {
      // 弹框询问是否删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('删除用户失败')
          }
          this.getUserList()
          return this.$message.success('删除成功!');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};
</script>

<style lang="less" scoped>
</style>

<template>
  <div class="User">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
           @input="getUserList" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-search"
               @click="showEditDialog(scope.row.id)" size="small"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)" size="small"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small" @click="showRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFromRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef"
       label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    
    <el-dialog
      title="分配角色"
      :visible.sync="RoleDialogVisiable"
      width="30%"
      center	
      @close="">
      <div class="Content">
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <!-- 内容主体区域 -->
        <el-select v-model="roleid" placeholder="请选择">
          <el-option
            v-for="item in RoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoleDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </span>
    </el-dialog>
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
      },
      // 分配角色对话框显示与隐藏
      RoleDialogVisiable: false,
      // 点击分配角色按钮，先保存当前用户信息
      userInfo: {},
      // 保存所有角色列表
      RoleList:[],
      // 选中当前select选框中的角色id
      roleid: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 点击确认按钮发送 设置角色
    setRoles() {
      this.$http.put('users/'+this.userInfo.id+'/role',{rid:this.roleid}).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error('分配角色失败')
        this.getUserList();
        this.$message.success('分配角色成功')
      })
      this.RoleDialogVisiable = !this.RoleDialogVisiable
    },
    showRoles(role) {
      this.userInfo = role
      // console.log(role);
      // 发送后台请求  获取所有角色
      this.$http.get('roles').then(res => {
        this.RoleList = res.data.data
        // console.log(this.RoleList);
      })
      this.RoleDialogVisiable = !this.RoleDialogVisiable
    },
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
.Content {
  text-align: center;
}
</style>

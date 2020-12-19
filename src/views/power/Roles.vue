<template>
  <div class="Roles">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 type="expand" -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" width="80px" label="角色id"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editRoles(scope.row.id)" size="medium" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" @click="deleteRole(scope.row.id)" size="medium" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="medium" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色面板"
      :visible.sync="addRoleVisible"
      width="30%" @close="addRoleClose">
      <el-form :model="addRoleFrom" :rules="addRoleFromRules" ref="addRoleFromRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title=""
      :visible.sync="editRoleVisible"
      width="width"
      @close="editRoleClose">
      <el-form :model="editFrom" :rules="addRoleFromRules" ref="editRoleFromRef" label-width="80px">
        <el-form-item label="角色id">
          <el-input v-model="editFrom.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        // 所有角色列表数据
        rolesList: [],
        // 添加角色框
        addRoleVisible: false,
        // 添加用户表单数据
        addRoleFrom: {
          roleName: '',
          roleDesc: ''
        },
        // 添加用户的验证规则
        addRoleFromRules: {
          roleName: [
            {required: true, message:'请输入角色名称', trigger: 'blur'},
            {require: true, min: 3, max: 10, message: '长度必须在 3 到 10 个字符之间', trigger: 'blur' }
          ],
          roleDesc: [
            {required: true, message:'请输入角色描述', trigger: 'blur'},
            {require: true, min: 3, message: '长度必须在 3 个字符以上', trigger: 'blur' }
          ]
        },
        editRoleVisible: false,
        editFrom: {
          roleName: '',
          roleDesc: ''
        }
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      getRolesList() {
        this.$http.get('roles').then(re => {
          const res = re.data
          if(res.meta.status !== 200){
            return this.$message.error('获取角色列表失败');
          }
          this.rolesList = res.data
          console.log(this.rolesList);
        })
      },
      addRole() {
        this.addRoleVisible = !this.addRoleVisible
      },
      addRoleClose() {
        this.$refs.addRoleFromRef.resetFields()
      },
      addRoleInfo() {
        this.$refs.addRoleFromRef.validate((valid) => {
          if (!valid) return this.$message.error('请输入合法数据')
          this.$http.post('roles', this.addRoleFrom).then(re => {
            const res = re.data
            if(res.meta.status !== 201) return this.$message.error('添加角色失败');
            this.addRoleVisible = false
            this.$message.success('添加角色成功')
            this.getRolesList()
          })
        })
      },
      editRoles(id) {
        this.$http.get('roles/' + id).then(re => {
          const res = re.data
          if(res.meta.status !== 200) return this.$message.error('获取角色信息失败')
          this.editFrom = res.data
          this.editRoleVisible = !this.editRoleVisible
        })
      },
      editRoleClose() {
        this.$refs.editRoleFromRef.resetFields()
      },
      editRoleInfo() {
        this.$refs.editRoleFromRef.validate(valid => {
          if (!valid) return this.$message.error('请输入合法数据')
          this.$http.put('roles/' + this.editFrom.roleId, {
            roleName: this.editFrom.roleName,
            roleDesc: this.editFrom.roleDesc
          }).then(re => {
            const res = re.data
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('修改信息失败')
            this.$message.success('修改信息成功')
            this.getRolesList()
            this.editRoleVisible = false
          })
        })
      },
      deleteRole(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${id}`).then(res => {
            if(res.data.meta.status !== 200){
              return this.$message.error('删除角色失败')
            }
            this.getRolesList()
            return this.$message.success('删除成功!');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  };
</script>

<style lang="less" scoped>

</style>

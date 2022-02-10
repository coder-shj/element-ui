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
      <el-table :data="rolesList" lazy border stripe>
        <!-- 展开列 type="expand" -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(item1,index) in props.row.children" :key="item1.id" :class="['botter-bd', index==0?'botter-bt':'']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="DeleteRight(props.row.id,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 循环二级权限 -->
                <el-row v-for="item2 in item1.children" :key="item2.id" class="botter-bd">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="DeleteRight(props.row.id,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" style="margin: 5px;" v-for="item3 in item2.children" @close="DeleteRight(props.row.id,item3.id)">{{item3.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" width="70%" label="角色id"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editRoles(scope.row.id)" size="medium" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" @click="deleteRole(scope.row.id)" size="medium" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" @click="showRights(scope.row)" size="medium" icon="el-icon-setting">分配权限</el-button>
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
      title="编辑"
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
    <!-- 分配权限dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="RightsDialogVisible"
      width="50%"
      @close="closeRight">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="showCheckArr"
        :props="RightProps"
        ref="Rightstree">
      </el-tree>
      <!-- getCheckedKeys -->
      <div slot="footer">
        <el-button @click="RightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // function fun(ele,arr) {
  //   if(!ele.children){
  //     return arr.push(ele.id)
  //   }
  //   // 递归
  //   ele.children.forEach(item=>fun(item,arr))
  // }
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
        },
        // 控制权现况是否隐藏
        RightsDialogVisible:false,
        // 存储所有权限
        rightsList:[],
        // 展示选中的权限选项
        showCheckArr:[],
        // props属性选项
        RightProps: {
          label:'authName',
          children:'children'
        },
        // 保存此时角色id
        RoleId: Number
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      DeleteRight(roleId,rightId) {
        this.$http.delete('roles/'+roleId+'/rights/'+rightId).then(res => {
          if(res.data.meta.status == 200){
            // 刷新权限下拉栏
            this.getRolesList()
            return this.$message.success('取消权限成功');
          }else {
            // 刷新权限下拉栏
            this.getRolesList()
            return this.$message.error('取消权限失败');
          }
        })
      },
      showRights(role) {
        //展示分配权限
        this.$http.get('rights/tree').then( res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('获取权限列表失败');
          }
          this.rightsList = res.data.data;
        })
        // 用树形控件展示到dialog对话框
        // 把此时角色所拥有的权限全部展示出来 dafault-checked-keys
        // console.log(role)
        // 把当前角色放到函数中去递归循环，把所得到的节点id放到showCheckArr数组中
        this.getCheckedNodes(role,this.showCheckArr)
        // console.log(this.showCheckArr)
        // 展示dialog对话框
        
        // 保存角色id
        this.RoleId = role.id;
        this.RightsDialogVisible = !this.RightsDialogVisible
      },
      getCheckedNodes(node, arr){
        if(!node.children){
          return arr.push(node.id)
        }
        // 递归
        node.children.forEach(item=>this.getCheckedNodes(item,arr))
      },
      // 关闭分配权限的dialog对话框时  对上一节点数据清空
      closeRight() {
        this.showCheckArr = []
      },
      // 点击确认按钮  发送后台数据  分配权限 
      setRight() {

        // console.log('全选',this.$refs.Rightstree.getCheckedKeys());
        // console.log('半选',this.$refs.Rightstree.getHalfCheckedKeys());

        // 获取所有全选节点id和半选节点id 并合并到一个数组
        var arrCheckAllkeys=[...this.$refs.Rightstree.getCheckedKeys(),...this.$refs.Rightstree.getHalfCheckedKeys()]
        // 将数组与字符串之间相互转换
        arrCheckAllkeys = arrCheckAllkeys.join(',')
        // console.log(typeof arrCheckAllkeys);   // 判断输出数据类型

        // 发送给后台请求
        console.log('roles/:'+ this.RoleId +'/rights');
        this.$http.post('roles/'+ this.RoleId +'/rights',{rids: arrCheckAllkeys}).then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('修改角色权限失败');
          }
          // 刷新角色列表
          this.getRolesList()
          this.$message.success('修改角色权限成功');
        })

        this.RightsDialogVisible = !this.RightsDialogVisible
      },
      getRolesList() {
        console.log('更新');
        this.$http.get('roles').then(re => {
          const res = re.data
          if(res.meta.status !== 200){
            return this.$message.error('获取角色列表失败');
          }
          this.rolesList = res.data
          // console.log(this.rolesList);
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

<style lang="less" scoped="scoped">
  .botter-bd{
    border-bottom: 1px solid #ddd;
  }
  .el-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .botter-bt{
    border-top: 1px solid #ddd;
  }
</style>

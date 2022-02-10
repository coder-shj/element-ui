<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="addCategariesVisible=true">添加分类</el-button>
        </el-col>    
      </el-row>

      <!-- 树形表格组件 -->
      <tree style="margin-top:10px" :data="CategariesList" :columns="columns" show-header show-index index-text='#'
      :selection-type='false' :expand-type='false' border>
        <template slot="effect" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == '1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-delete" size="small" @click="DeleteCategories(scope.row.cat_id)">删除</el-button>
          </el-tooltip>
        </template>
      </tree>
      

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCategariesVisible"
        width="50%" @close="addCategariesClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules"
          ref="addFromRef" label-width="90px">
          <el-form-item label="父ID" prop="cat_pid">
            <el-input v-model="addForm.cat_pid" placeholder="请输入父ID，若为一级分类请填写0"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类层级">
            <el-select v-model="addForm.cat_level" placeholder="请选择分类层级">
              <el-option label="一级" value="0"></el-option>
              <el-option label="二级" value="1"></el-option>
              <el-option label="三级" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategariesVisible = false">取 消</el-button>
          <el-button type="primary" @click="setCategaries">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类的对话框 -->
      <!-- <el-dialog
        title="编辑分类"
        :visible.sync="editCategariesVisible"
        width="50%" @close="editCategariesClosed"> -->
        <!-- 内容主体区域 -->
        <!-- 底部区域 -->
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="editCategariesVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategaries">确 定</el-button>
        </span>
      </el-dialog> -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Catagories",
  data() {
    return {
      // 获取分类列表的参数对象
      queryInfo: {
        // 查询参数
        type: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
      },
      // 数据总数
      total: 5,
      // 所有分类列表
      CategariesList: [],
      //绑定各列数据
      columns: [
        {label: '分类名称',prop:'cat_name'},
        {label:'是否有效',prop:'',type:'template',template:'effect'},
        {label:'排序',prop:'',type:'template',template:'order'},
        {label:'操作',prop:'',type:'template',template:'operation'}
      ],
      // 添加分类对话框显示
      addCategariesVisible: false,
      // 添加用户的表单数据
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        cat_pid: [
          {required: true, message:'请输入父ID', trigger: 'blur'},
          {min: 1,
          max: 5,
          message:'父ID必须在1~5个字符之间',
          trigger: 'blur'}
        ],
        cat_name: [
          {required: true, message:'请输入分类名称', trigger: 'blur'},
          {min: 3,
          max: 10,
          message:'分类名称必须在6~15个字符之间',
          trigger: 'blur'}
        ],
        cat_name: [
          {required: true, message:'请选择分类层级', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    // 获取分类列表
    this.getCategariesList()
  },
  methods: {
    // 获取分类列表
    getCategariesList() {
      this.$http.get('categories',{
        params: this.queryInfo
      }).then(re => {
        const res = re.data
        if(res.meta.status !== 200){
          return this.$message.error('获取商品列表失败')
        }
        this.total = res.data.total
        this.CategariesList = res.data.result;
        console.log(this.CategariesList);
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCategariesList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCategariesList()
    },
    // 添加分类窗口关闭监听
    addCategariesClosed() {
      this.$refs.addFromRef.resetFields()
      this.addForm = {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      }
    },
    // 添加分类
    setCategaries() {
      console.log(this.addForm);
      this.$refs.addFromRef.validate(valid => {
        if(!valid) return this.$message.error('请输入合法数据');
        if(this.cat_level == '') return this.$message.error('请选择分类层级');
        this.$http.post('categories', this.addForm).then(res => {
          console.log(res);
          if(res.data.meta.status !== 201){
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.addCategariesVisible = false
          this.getCategariesList()
        })
      })
    },
    DeleteCategories(id) {
      // 弹框询问是否删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${id}`).then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('删除用户失败')
          }
          this.getCategariesList()
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
}
</script>

<style>

</style>
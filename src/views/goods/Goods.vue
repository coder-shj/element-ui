<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
           :clearable="true" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="targetAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" min-width="200" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time|getTime()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-search"
               @click="changeGood(scope.row)" size="small"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="DeleteGoods(scope.row.goods_id)" size="small"></el-button>
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

    <el-dialog title="修改" :visible.sync="changeVisible" @close="ChangeClosed">
      <el-form :model="changeForm" :rules="changeRules" label-position="left" label-width="100px" ref="addFromRef">
        <el-form-item prop="goods_name" label="商品姓名">
          <el-input v-model="changeForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item prop="goods_price" label="商品价格">
          <el-input v-model="changeForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item prop="goods_number" label="商品数量">
          <el-input v-model="changeForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item prop="goods_weight" label="商品重量">
          <el-input v-model="changeForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeVisible=false">取 消</el-button>
        <el-button type="primary" @click="setChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'goods',
  data() {
    let checkInt = (rule, value, callback) =>{
      if (Number(value) && value >=0) {
        console.log(value);
        callback();
      }else {
        return callback(new Error("请输入正数! "));
      }
    };

    return {
      // 获取分类列表的参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
      },
      // 存储商品数据
      goodsList: [],
      // 存储商品总数
      total: 0,
      changeVisible: false,
      changeForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      changeId: Number,
      changeRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur'},
          { validator: checkInt,trigger: "blur" , required: true}
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur'},
          { validator: checkInt,trigger: "blur" , required: true}
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur'},
          { validator: checkInt,trigger: "blur" , required: true}
        ],
      }
    }
  },
  created() {
    // 获取商品列表
    this.getGoodsList();
  },
  methods: {
    ChangeClosed() {
      this.$refs.addFromRef.resetFields()
      this.changeForm = {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      }
    },
    setChange() {
      this.$refs.addFromRef.validate(valid => {
        if(!valid) return this.$message.error('请输入合法数据');
        this.$http.put(`goods/${this.changeId}`, this.changeForm).then(res => {
          this.$message('暂未添加此功能')
          this.changeVisible = false;
        })
      })
    },
    changeGood(row) {
      console.log(row);
      this.changeId = row.goods_id;
      this.changeForm.goods_name = row.goods_name;
      this.changeForm.goods_price = row.goods_price;
      this.changeForm.goods_number = row.goods_number;
      this.changeForm.goods_weight = row.goods_weight;
      this.changeVisible = true;
    },
    // 获取商品列表
    getGoodsList() {
      this.$http.get('goods',{
        params: this.queryInfo
      }).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error('获取商品列表失败');
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 点击添加商品，天转到添加商品页面
    targetAdd() {
      this.$router.push('/goods/add');
    },
    DeleteGoods(id) {
      console.log(id);
      // 弹框询问是否删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${id}`).then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('删除用户失败')
          }
          this.getGoodsList()
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
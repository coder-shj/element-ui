<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
           :clearable="true" @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="OrdersList"  border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'" type="success">已付款</el-tag>
            <el-tag v-else type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="update_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.update_time|getTime()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit"
               @click="ChangeAddress" size="small"></el-button>
            </el-tooltip>
            <!-- 物流信息 -->
            <el-tooltip effect="dark" content="物流信息" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-map-location"
               @click="OpenPost(scope.row)" size="small"></el-button>
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
        :total="total"
        >
      </el-pagination>

      <!-- 修改地址的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="ChangeAddressVisible"
        width="50%" @close="ChangeAddressVisible=false">
        <!-- 内容主体区域 -->
        <div>
          <el-form label-width="100px" :model="AddressFrom" :rules="AddressFromRules">
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader
                v-model="AddressFrom.address1"
                :options="cityData"
                :props="{ expandTrigger: 'hover' }">
              </el-cascader>
            </el-form-item>
            <el-form-item label="名称" prop="address2">
              <el-input v-model="AddressFrom.address2"></el-input>
            </el-form-item>
          </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ChangeAddressVisible = false">取 消</el-button>
          <el-button type="primary" @click="ChangeAddressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查看货运的对话框 -->
      <el-dialog
        title="物流信息"
        :visible.sync="PostVisible"
        width="50%" @close="PostVisible=false">
        <!-- 内容主体区域 -->
        <div>
          <el-timeline :reverse="false">
            <el-timeline-item
              v-for="(activity, index) in ProgressInfo"
              :key="index"
              :timestamp="activity.time">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import cityData from 'components/common/citydata.js'
export default {
  name: 'orders',
  data() {
    return {
      // 获取分类列表的参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      // 数据总数
      total: 5,
      // 所有分类列表
      OrdersList: [],
      PostVisible:false,
      ProgressInfo: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
      ChangeAddressVisible: false,
      AddressFrom: {
        address1: [],
        address2: ''
      },
      AddressFromRules: {
        address1: [
          { required: true, message: '请选择省市县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
    }
  },
  created(){
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    getOrdersList(){
      this.$http.get('orders',{
        params: this.queryInfo
      }).then(res => {
        if(res.data.meta.status!==200) return this.$message.error('获取信息失败');
        this.OrdersList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrdersList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrdersList()
    },
    OpenPost(row){
      this.PostVisible = true;
    },
    ChangeAddress(){
      this.ChangeAddressVisible = true;
    }
  }
}
</script>

<style>
.el-cascader{
  width: 100%;
}
</style>
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告框 -->
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps style="margin-top: 10px" :active="Number(activeName)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="动态参数"></el-step>
        <el-step title="静态参数"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form label-position="top" :model="addForm" label-width="80px" :rules="addFormRul" ref="addFormRef">
        <!-- tabs选项卡 -->
        <el-tabs v-model="activeName" tab-position="left" :before-leave="beforeLeaveTabs">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="Number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="Number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="Number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" ref="catRef">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="categoryList"
                :props="cateProps"
                @change="cateChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态参数" name="1">
            <el-form-item v-for="item in manyArr" :label="item.attr_name" :key="item.cat_id">
              <el-checkbox-group v-model="item.attr_vals.split(',')">
                <el-checkbox :label="val" v-for="(val,i) in item.attr_vals.split(',')" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-form-item v-for="item in onlyArr" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="uplode-demo"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers='uploadheader'
              list-type="picture"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
             <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      width="30%"
      :visible.sync="PreVisible">
      <img :src="preViewUrl" style="width:100%;">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '0',
      // 添加商品参数
      addForm: {
        goods_name: '',
        // 保存选择的商品分类参数
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 存放图片的数组
        pics:[],
        // 富文本绑定内容
        goods_introduce:'',
        // 包含动态参数与静态参数
        attrs:[]
      },
      // 添加商品验证规则
      addFormRul: {
        goods_name: [ { required: true, message: '请输入商品名称', trigger: 'blur' } ],
        goods_price: [ { required: true, message: '请输入商品价格', trigger: 'blur' } ],
        goods_weight: [ { required: true, message: '请输入商品重量', trigger: 'blur' } ],
        goods_number: [ { required: true, message: '请输入商品数量', trigger: 'blur' } ],
        goods_cat: [ { required: true, message: '请选择商品分类', trigger: 'blur' } ],
      },
      // 保存当前商品分类
      categoryList: [],
      // 分类级联选择器的props属性
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        expandTrigger: 'hover'
      },
      // 保存动态参数数据
      manyArr:[],
      manyArrItem: [],
      // 保存静态参数数据
      onlyArr:[],
      // 上传图片地址
      url:'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传时的请求头设置
      uploadheader:{
        Authorization : window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      preViewUrl:'',
      // 预览对话框
      PreVisible: false,
    }
  },
  methods: {
    // 添加商品
    addGoods() {
      // 1.先处理参数
      // good_cat转换成字符
      this.addForm.goods_cat = this.addForm.goods_cat.join(',');
      // 处理attrs  包含动、静态参数
      // manyArr:[],
      // manyArrItem: [],
      this.manyArr.forEach(item => {
        this.addForm.attrs.push({attr_id:item.attr_id,attr_vals:item.attr_vals});
      })
      this.onlyArr.forEach(item => {
        this.addForm.attrs.push({attr_id:item.attr_id,attr_vals:item.attr_vals});
      })

      console.log(this.addForm);
      this.$http.post('goods',this.addForm).then(res=> {
        if(res.data.meta.status != 201) this.$message.error('添加商品失败');
        this.$message.success('创建商品成功');
        // 跳转到商品列表页
        this.$router.push('/goods')
      })

    },
    // 上传成功的钩子函数
    handleSuccess(file) {
      this.addForm.pics.push({img:file.data.tmp_path});
      // console.log(this.addForm.pics)
    },
    // 预览图片钩子
    handlePreview(file) {
      this.preViewUrl = file.response.data.url;
      this.PreVisible = true;
      // console.log(file);
    },
    // 删除图片钩子
    handleRemove(file) {
      // 找到存放临时地址的数组  找到删除图片的路径 然后删除
      var index = this.addForm.pics.findIndex(el=>el.img==file.response.data.tmp_path);
      this.addForm.pics.splice(index,1);
    },
    // 获取所有商品分类，渲染到级联选择器
    getCategories() {
      this.$http.get('categories').then(res => {
        this.categoryList = res.data.data;
      })
    },
    // 当分类级联选择框发生变化时出发
    cateChange() {
      // 对某一数据进行单独验证
      this.$refs.addFormRef.validateField('goods_cat', (valid) => {
        //valid返回的是规则集中写的错误提示信息，如果满足条件，返回的就是空
        if(!valid){
          return
        }
      })

      // 直接清除表单域下该字段的提示信息
      // this.$refs.addFormRef.clearValidate();

      if(this.addForm.goods_cat.length !== 3){
        // 如果选择分类不为三级分类
        this.addForm.goods_cat = []
        return this.$message.warning('请选择三级分类')
      }
    },
    // 当切换到下一个tabs选项之前触发
    beforeLeaveTabs(activeName, oldActiveName) {
      if(oldActiveName == '0')
      {
        var flag = true;
        this.$refs.addFormRef.validate((valid) => {
          if (valid) {
            return true;
          } else {
            this.$message.error('请输入合法数据')
            flag = false
            return false;
          }
        });
      }
      if(activeName == '1') {
        this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}}).then(res => {
          this.manyArr = res.data.data
        })
      }
      if(activeName == '2') {
        this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'only'}}).then(res => {
          // console.log(res);
          this.onlyArr = res.data.data
        })
      }
      
      return flag;
    },
  },
  created() {
    this.getCategories()
  }
}
</script>

<style>
.ql-editor {
  min-height: 250px;
}
</style>
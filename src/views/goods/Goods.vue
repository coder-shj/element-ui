<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name:'goods',
  data() {
    return {

    }
  },
  created() {
    // 获取商品列表
    console.log('123');
    // this.getGoodsList()
  },
  method: {
    // 获取商品列表
    getGoodsList() {
      this.$http.get('goods').then(res => {
        console.log(res);
        return ;
      })
    }
  }
}
</script>

<style>

</style>
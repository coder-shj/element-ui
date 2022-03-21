<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name:'params',
  data() {
    return {

    }
  },
  created() {
    this.getParamsList()
  },
  methods: {
    // 获取参数列表
    getParamsList() {
    }
  }
}
</script>

<style>

</style>
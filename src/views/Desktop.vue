<template>
  <div class="Desktop">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>桌面</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>“专升本”报名管理信息系统</h1>
    <h3>数据统计</h3>
  </div>
</template>

<script>
  export default {
    name: "Desktop"
  };
</script>

<style lang="less" scoped>
h1{
  text-align: center;
  font-size: 50px;
  font-weight: 500;
  height: 40px;
}
h3{
  text-align: center;
  font-size: 27px;
  font-weight: 500;
  height: 30px;
}
</style>

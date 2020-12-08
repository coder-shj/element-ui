<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="rgb(64, 158, 255)">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="child in item.children" :index="child.id + ''" :key="child.id">
              <i class="el-icon-setting"></i>
              <span slot="title">{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主题区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menulist: []
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      getMenuList() {
        this.$http.get('menus').then(res => {
          if(res.data.meta.status !== 200) return this.$message.console.error(res.data.meat.msg);
          this.menulist = res.data.data
          console.log(this.menulist);
        })
      }
    },
    created() {
      this.getMenuList()
    }
  };
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  // 左右贴边对齐
  display: flex;
  justify-content: space-between;

  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  img {
    height: 60px;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #EAEDF1;
}
</style>

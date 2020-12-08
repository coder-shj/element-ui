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
      <el-aside :width="isClooapse ? '64px': '200px'">
        <div class="toggle-button" @click="togglebuttom">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu 
          background-color="#333744" 
          text-color="#fff" 
          active-text-color="rgb(64, 158, 255)"
          unique-opened
          :collapse="isClooapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" 
            v-for="(item, index) in menulist" 
            :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[index]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item v-for="child in item.children" :index="'/' + child.path" :key="child.id" @click="saveNavState('/' + child.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menulist: [],
        icons: [
          'iconfont icon-users', 
          'iconfont icon-tijikongjian', 
          'iconfont icon-shangpin',
          'iconfont icon-danju',
          'iconfont icon-baobiao'],
          // 是否折叠
        isClooapse: false,
        // 被激活的连接地址
        activePath: ''
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
        })
      },
      // 点击按钮切换折叠与展开
      togglebuttom() {
        this.isClooapse = !this.isClooapse
      },
      saveNavState(activepath) {
        window.sessionStorage.setItem('activepath', activepath)
        this.activePath = activepath
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activepath')
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
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #EAEDF1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上为手
  cursor: pointer;
}
</style>

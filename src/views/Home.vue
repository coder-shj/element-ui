<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="~assets/logo.png" alt=""> -->
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
          :collapse="isClooapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">

          <el-menu-item v-for="(item, index) in menulist"
            :index="path[index]" 
            :key="index"
            @click="MenuClick(index)">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[index]"></i>
              <!-- 文本 -->
              <span>{{item}}</span>
            </template>
          </el-menu-item>

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
        menulist: [
          '(桌面)超级管理员',
          '通知公告',
          '基础信息管理',
          '注册管理',
          '报名信息管理',
          '审核官立',
          '考场安排管理',
          '成绩管理',
          '录取管理',
          '管理员信息管理'
        ],
        icons: [
          'el-icon-menu',
          'iconfont icon-users', 
          'iconfont icon-tijikongjian', 
          'iconfont icon-shangpin',
          'iconfont icon-danju',
          'iconfont icon-baobiao',
          'iconfont icon-users',
          'iconfont icon-users',
          'iconfont icon-users',
          'iconfont icon-users'],
          // 是否折叠
        isClooapse: false,
        // 被激活的连接地址
        activePath: '',
        path: [
          'desktop',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          'manner'
        ]
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // getMenuList() {
      //   this.$http.get('menus').then(res => {
      //     if(res.data.meta.status !== 200) return this.$message.console.error(res.data.meat.msg);
      //     this.menulist = res.data.data
      //   })
      // },
      // 点击按钮切换折叠与展开
      togglebuttom() {
        this.isClooapse = !this.isClooapse
      },
      // saveNavState(activepath) {
      //   window.sessionStorage.setItem('activepath', activepath)
      //   this.activePath = activepath
      // }
      MenuClick(index) {
        console.log(index);
        window.sessionStorage.setItem('activepath', index)
        if(index == 0) {

        }else if(index == 9) {

        }else {

        }
      }
    },
    created() {
      // this.getMenuList()
      // this.activePath = window.sessionStorage.getItem('activepath')
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

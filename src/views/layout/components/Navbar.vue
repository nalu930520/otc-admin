<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <p class="user-name">{{name}}</p>
        <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
@Component({
  components: {
    Breadcrumb,
    Hamburger
  }
})
export default class Navbar extends Vue {
  @Getter('sidebar') sidebar
  @Getter('avatar') avatar
  @Getter('name') name
  toggleSideBar() {
    this.$store.dispatch('ToggleSideBar')
  }
  logout() {
    this.$store.dispatch('LogOut').then(() => {
      this.$router.push({
        path: '/login'
      })
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    top: 0;
    .user-name{
      line-height: 50px;
      margin: 0;
      display: inline-block;
      padding-right: 10px;
    }
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      display: flex;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-top: 5px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="logo_box">
        <router-link to="/">
          <img :src="imgLogo" alt="logo"/>
        </router-link>
      </div>
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<style>
.logo_box{
  padding: 1rem;
  background-color: #002140;
  text-align: center;
}
</style>

<script lang="ts">
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import img_logo from '@/assets/logo_white.png'

@Component({
  components: {
    SidebarItem,
    ScrollBar
  }
})
export default class Sidebar extends Vue {
  imgLogo = img_logo
  @Getter('permission_routers') permission_routers
  @Getter('sidebar') sidebar
  get routes() {
    const $router: any = this.$router
    return $router.options.routes
  }
  get isCollapse() {
    return !this.sidebar.opened
  }
}

</script>

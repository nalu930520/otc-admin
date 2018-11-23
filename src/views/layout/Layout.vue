<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script lang="ts">
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
})
export default class Layout extends Vue {
  get sidebar() {
    return this.$store.state.app.sidebar
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<template>
  <div class="app-wrapper" :class="store.getters.sidebarOpened ? '' : 'hideSidebar'">
    <!-- PC端侧栏 -->
    <sidebar id="guide-sidebar" class="sidebar-container" :collapse="!store.getters.sidebarOpened" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <div class="content-container">
        <app-main />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import AppMain from './component/AppMain'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
const store = useStore()
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.app-wrapper {
  position: relative;

  // 侧栏展开
  .sidebar-container {
    transition: width #{$sidebarDuration};
    width: $sideBarWidth;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }

  .main-container {
    min-width: 1200px;
    height: 100vh;
    margin-left: $sideBarWidth;
    transition: margin-left #{$sidebarDuration};
    background-color: var(--qz-admin-app-main-bg-color);

    .fixed-header {
      transition: width #{$sidebarDuration};
    }
  }

  // 侧栏隐藏
  &.hideSidebar {
    .sidebar-container {
      width: $hideSideBarWidth;
    }

    .main-container {
      margin-left: $hideSideBarWidth;
    }
  }
}
</style>

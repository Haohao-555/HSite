<template>
  <div class="side">
    <div class="logo-container">
      <svg-icon icon="logo" v-if="collapse" class-name="logo-icon" />
      <h1 class="logo-title" v-if="!collapse">
        {{ config.project }}
      </h1>
    </div>
    <el-scrollbar>
      <sidebar-menu :collapse="collapse"></sidebar-menu>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import SidebarMenu from './SidebarMenu'
import config from '@/setting'
import { ASIDE_COLOR } from '@/constant'
const asideColor = ASIDE_COLOR
defineProps({
  collapse: {
    type: Boolean,
    default: false,
    validator: function (value) {
      return [true, false].indexOf(value) !== -1
    }
  }
})
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.side {
  background-color: v-bind(asideColor);
  border-right: 1px solid var(--qz-admin-aside-border-color);
  height: 100vh;

  .logo-container {
    height: #{$headerHeight};
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--qz-admin-aside-border-color);

    .logo-title {
      color: #fff;
      line-height: 50px;
      font-weight: 600;
      font-size: 24px;
      white-space: nowrap;
    }
  }
}

::v-deep .svg-icon.logo-icon {
  font-size: 20px !important;
  margin-right: 0px !important;
}
</style>

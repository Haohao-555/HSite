<template>
  <div class="navbar">
    <div>
      <hamburger class="hamburger-container" />
      <breadcrumb id="guide-breadcrumb" class="breadcrumb-container" />
    </div>
    <div class="right">
      <div class="menu">
        <div v-for="(item, id) in toolsList" :key="id">
          <component :is="item.component" class="menu-item"></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

import hamburger from '@/components/Hamburger/index'
import breadcrumb from '@/components/Breadcrumb/index'
import ThemeSelect from '@/components/ThemeSelect/index'
import SwitchDark from '@/components/SwitchDark/index'
import HeaderSearch from '@/components/HeaderSearch/index'
import Screenfull from '@/components/Screenfull/index'
import SiteBtn from '@/components/SiteBtn/index'
import Logout from '@/components/Logout/index'

// 功能区域
const toolsList = computed(() => {
  return [
    { id: 6, component: SiteBtn },
    { id: 1, component: SwitchDark },
    { id: 2, component: ThemeSelect },
    { id: 4, component: Screenfull },
    { id: 6, component: Logout },
    { id: 5, component: HeaderSearch }
  ]
})
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.navbar {
  height: #{$headerHeight};
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  padding-right: 12px;
  box-sizing: border-box;
  position: relative;
  background-color: var(--qz-nav-bg-color);
  border-bottom: 1px solid var(--qz-admin-border-color);

  .hamburger-container {
    line-height: #{$headerHeight};
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.5s;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;

    .menu {
      display: flex;
      align-items: center;

      ::v-deep .menu-item {
        display: inline-block;
        padding: 6px 18px 0 0;
        padding-top: 2px;
        font-size: 22px;
        color: var(--qz-admin-text-color);
        vertical-align: text-bottom;
        cursor: pointer;
      }
    }

    ::v-deep .avatar-container {
      cursor: pointer;
    }
  }
}
</style>

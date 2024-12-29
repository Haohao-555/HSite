<template>
  <div
    v-if="$store.getters.isMobile || !$store.getters.showBanner"
    class="bg"
    :style="renderStyle(bgItem)"
  />
  <el-carousel
    v-else
    height="100vh"
    motion-blur
    indicator-position="none"
    arrow="always"
    :interval="3000"
  >
    <el-carousel-item v-for="(item, key) in bannerList" :key="key">
      <div class="bg" :style="renderStyle(item)" />
    </el-carousel-item>
  </el-carousel>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  bannerList: {
    type: Array,
    default: () => []
  },
  bgItem: {
    type: Object,
    default: () => {}
  }
})

const renderStyle = (item) => {
  let style = {
    backgroundImage: 'url(' + item.url + ')'
  }
  if (item.style) {
    style = Object.assign(style, item.style)
  }
  return style
}
</script>
<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
::v-deep .el-carousel__container {
  .el-carousel__arrow {
    display: none;
  }
}
</style>

<template>
  <el-card :body-style="{ padding: '0px' }">
    <div :class="$store.getters.isMobile ? 'mobile-carousel' : 'carousel'">
      <img :src="require('@/assets/blog_3.webp')" />
    </div>
  </el-card>
</template>
<script setup></script>
<style lang="scss" scoped>
.mobile-carousel {
  height: 200px;
}
.carousel {
  height: 260px;
}
</style>

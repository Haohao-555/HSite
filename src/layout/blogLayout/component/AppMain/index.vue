<template>
  <el-scrollbar class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
          <component
            :is="Component"
            :key="route.path"
          ></component>
      </transition>
    </router-view>
  </el-scrollbar>
</template>
<script setup>
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
</style>

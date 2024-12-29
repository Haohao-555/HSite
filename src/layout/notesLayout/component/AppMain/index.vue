<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path"></component>
  </router-view>
</template>
<script setup></script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
</style>

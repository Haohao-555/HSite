<template>
  <div :class="$store.getters.isMobile ? 'mobilepage' : ''">
    <app-main />
  </div>
</template>
<script setup>
import AppMain from './component/AppMain'
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.mobilepage {
  position: relative;
}
</style>

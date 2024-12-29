<template>
  <div v-if="row.images[0]" class="imgRange">
    <el-image class="img-container" fit="cover" :src="row.images[0].url" />
    <span class="img-text">共 {{ row.images.length }} 张</span>
  </div>
  <div v-else></div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  row: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped>
.imgRange {
  display: flex;
  align-items: center;

  .img-container {
    width: 40px;
    height: 40px;
    border-radius: 6px;
  }

  .img-text {
    margin-left: 6px;
  }
}
</style>

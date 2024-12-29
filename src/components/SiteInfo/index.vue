<template>
  <div class="site-info">
    <ul class="info">
      <li class="info-item" v-for="(item, i) in siteInfoList" :key="i">
        <span class="text">{{ item.text }}</span>
        <span class="num">{{ item.num }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { reactive } from 'vue'

const siteInfoList = reactive([
  {
    text: '文章数目',
    num: 100
  },
  {
    text: '已运行时间',
    num: '66 天'
  },
  {
    text: '本站总字数',
    num: '67.5k'
  },
  {
    text: '本站访客数',
    num: 1581
  },
  {
    text: '本站总访问数',
    num: 1400
  },
  {
    text: '最后更新时间',
    num: '32 分钟前'
  }
])
</script>
<style lang="scss" scoped>
.site-info {
  .info {
    padding-top: 12px;
    border-top: 1px solid var(--qz-admin-border-color);
    .info-item {
      padding: 6px 8px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
  }
}
</style>

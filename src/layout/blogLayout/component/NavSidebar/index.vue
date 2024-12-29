<template>
  <el-card class="nav-side" :body-style="{ padding: '20px 0' }">
    <User-info :info="userinfo" />
    <Site-info />
  </el-card>
</template>
<script setup>
import { reactive } from 'vue'
import UserInfo from '@/components/UserInfo'
import SiteInfo from '@/components/SiteInfo'

const userinfo = reactive({
  avaUrl: 'https://i.loli.net/2021/07/25/B7uKGgRdVXp8L3N.jpg',
  nickName: '浩小孩',
  signature: '我只想奔赴属于我的远方',
  tagList: [
    { text: '文章', num: '100' },
    { text: '标签', num: '12' },
    { text: '分类', num: '10' }
  ]
})
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.nav-side {
  .route {
    padding-top: 20px;
  }
}
</style>

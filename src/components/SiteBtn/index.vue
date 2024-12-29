<template>
  <el-dropdown>
    <el-button><span style="margin-right: 12px;">跳转其他站点</span><el-icon><arrow-down /></el-icon></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="toNotesPage">日记站点</el-dropdown-item>
        <el-dropdown-item :disabled="true">简历站点</el-dropdown-item>
        <el-dropdown-item @click="toBlogPage">博客站点</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toNotesPage = () => {
  router.push({
    path: '/notes'
  })
}

const toBlogPage = () => {
  router.push({
    path: '/blog'
  })
}
</script>
<style lang="scss" scoped></style>

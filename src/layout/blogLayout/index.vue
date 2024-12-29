<template>
  <el-scrollbar height="100vh">
    <div :class="$store.getters.isMobile ? 'mobilepage' : ''">

      <el-row style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <Nav-header></Nav-header>
        </el-col>
      </el-row>
      <el-row justify="center" style="margin: 0;">
        <el-col :xs="20" :sm="20" :md="4" :lg="4" :xl="4">
          <nav-sidebar />
        </el-col>
        <el-col :xs="20" :sm="20" :md="16" :lg="16" :xl="16"><app-main /></el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>
<script setup>
import AppMain from './component/AppMain'
import NavSidebar from './component/NavSidebar'
import NavHeader from './component/NavHeader'
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.el-card {
  margin: 10px 5px !important;
  border-radius: 12px;
}
</style>

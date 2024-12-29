<template>
  <div :class="$store.getters.isMobile ? 'mobilenav-header' : 'nav-header'">
    <el-affix :offset="0">
      <div class="header-container"></div>
    </el-affix>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.nav-header {
  height: 460px;
  background-image: url('~@/assets/bg1.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right center;
}

.mobilenav-header {
  height: 50vh;
  background-image: url('~@/assets/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right center;
}
</style>

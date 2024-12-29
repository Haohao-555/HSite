<template>
  <el-config-provider :locale="$store.getters.language === 'en' ? en : zhCn" size="small">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { useStore } from 'vuex'
import { useTheme } from '@/hooks/useTheme'
import { useIsMobile } from '@/hooks/useIsMobile'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import i18n from '@/i18n'

const store = useStore()
const { initTheme } = useTheme()
// 避免刷新情况下，国际化无法匹配
i18n.global.locale.value = store.getters.language
// 监听屏幕是 移动端 或 PC端
useIsMobile()
// 初始化主题色
initTheme()
</script>
<style lang="scss">
#app {
  font-family: 'alimama';
}
</style>

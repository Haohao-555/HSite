<template>
  <el-tooltip content="退出登录">
    <div @click="handleLogout">
      <svg-icon class-name="icon-class" icon="logout" />
    </div>
  </el-tooltip>
</template>
<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { logout } from '@/api/admin'
import { removeAllItem } from '@/utils/storage'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const handleLogout = async () => {
  const res = await logout()
  if (res.errorno === 0) {
    store.commit('app/removeTagsView', { type: 'all' })
    removeAllItem()
    ElMessage.success('退出登录成功')
    router.push('/login')
  }
}
</script>
<style lang="scss" scoped>
::v-deep .icon-class {
  font-size: 22px;
  margin-right: 15px;
}
</style>

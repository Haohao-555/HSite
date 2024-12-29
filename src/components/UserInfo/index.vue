<template>
  <div class="userInfo">
    <div class="user-item">
      <div class="ava">
        <el-image style="width: 120px; height: 120px" :src="info.avaUrl" :fit="fit" />
      </div>
      <div class="nickName" @click="toAdmin">{{ info.nickName }}</div>
      <div class="signature">{{ info.signature }}</div>
      <div class="tag-list">
        <div class="item" v-for="(item, i) in info.tagList" :key="i">
          <span>{{ item.text }}</span>
          <span>{{ item.num }}</span>
        </div>
      </div>
      <div class="link-list">
        <el-check-tag v-for="item in info.linkList" :key="item" @change="goLink(item.link)">
          {{ item.text }}
        </el-check-tag>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({
  info: {
    type: Object,
    require: true
  }
})
const toAdmin = () => {
  router.push({
    path: '/bmanage/baseinfo'
  })
}
</script>
<style lang="scss" scoped>
.userInfo {
  text-align: center;

  .ava {
    ::v-deep .el-image {
      border-radius: 50%;
    }
  }

  .nickName {
    font-weight: 600;
    margin-top: 12px;
    cursor: pointer;
    font-size: 20px;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .signature {
    margin-top: 12px;
    font-size: 12px;
    cursor: pointer;
  }

  .tag-list {
    display: flex;
    padding-top: 20px;

    .item {
      flex: 1;
      flex-direction: column;

      span {
        display: block;
        line-height: 30px;
      }
    }
  }

  .link-list {
    padding-top: 20px;
  }
}
</style>

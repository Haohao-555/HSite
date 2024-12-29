<template>
  <el-card :body-style="{ padding: '0px' }" class="blog-card" @click="toDetail">
    <el-row style="margin: 0; height: 100%;">
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <div :class="$store.getters.isMobile ? 'mobilebg' : 'bg'" :style="{ backgroundImage: `url(${bg})` }"></div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <div class="content">
          <h3 class="title">10月27号、28号、29号、30四天PC端云音乐项目总结</h3>
          <div class="about">🌈前序 本来是昨天要写总结的，昨天就已经基本完成了将音乐进度条移植到项目中并且与音频实现联动的。</div>
        </div>
        <!-- <div class="info">
          <div class="classify">
            分类
            <el-tag size="small">云音乐项目</el-tag>
          </div>
          <div class="tag">
            标签
            <el-tag size="small">云音乐</el-tag>
          </div>
        </div> -->
        <div class="footer">
          <span class="publish">发布时间: 2024-12-08 15:00</span>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup>
import bg from '@/assets/1.jpg'
import { useRouter } from 'vue-router'
const router = useRouter()
const toDetail = () => {
  router.push({
    path: '/blogcontent',
    query: {
      id: 1
    }
  })
}
</script>
<style lang="scss" scoped>
.blog-card {
  cursor: pointer;

  &:hover {
    @media screen and (min-width: 970px) {
      transform: translateY(-10px);
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);

      .hover-box {
        left: 110%;
        transition: all 0.3s;
      }
    }
  }

  .mobilebg {
    height: 180px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
  }

  .bg {
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
  }

  .content {
    padding: 10px;

    .title {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-bottom: 12px;
      line-height: 32px;
    }

    .about {
      padding: 12px;
      box-sizing: border-box;
      line-height: 24px;
      text-align: justify;
      font-size: 15px;
    }
  }

  .info {
    padding-bottom: 10px;

    .classify,
    .tag {
      padding: 4px 8px;
      box-sizing: border-box;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .footer {
    border-top: 1px solid var(--el-color-primary);
    padding: 6px 0px;

    .publish {
      padding: 12px;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <el-card>
    <div class="article-container">
      <div class="title" style="display: flex;">☕ <beat-text text="文章推荐"></beat-text></div>
      <ul class="article-list">
        <li class="article-item" v-for="(article, i) in articleList" :key="i">
          <span class="bg" :style="{ backgroundImage: `url(${article.bgurl})` }"></span>
          <span class="content">
            <span class="title">{{ article.title }}</span>
            <span class="visit">
              <svg-icon icon="eye-open"></svg-icon>
              <span>{{ article.visit }}</span>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </el-card>
</template>
<script setup>
import BeatText from '@/components/BeatText'
import { reactive } from 'vue'
import bg from '@/assets/1.jpg'
const articleList = reactive([
  {
    title: '全网最全console命令解析总结',
    bgurl: bg,
    visit: 100
  },
  {
    title: '全网最全console命令解析总结',
    bgurl: bg,
    visit: 100
  },
  {
    title: '全网最全console命令解析总结',
    bgurl: bg,
    visit: 100
  },
  {
    title: '全网最全console命令解析总结',
    bgurl: bg,
    visit: 100
  }
])
</script>
<style lang="scss" scoped>
.article-container {
  .article-list {
    padding-top: 10px;

    .article-item {
      list-style: none;
      display: flex;
      padding: 4px 0px;

      .bg {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 6px;
        background-size: cover;
        background-repeat: no-repeat;
      }

      .content {
        padding-left: 8px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .title {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .visit {
          display: flex;
          align-items: center;
          line-height: 30px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

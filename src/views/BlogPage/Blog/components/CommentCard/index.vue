<template>
  <el-card>
    <div class="comment-container">
      <div class="title" style="display: flex;">⚡ <beat-text text="最新评论"></beat-text></div>
      <ul class="comment-list">
        <li class="comment-item" v-for="(item, i) in commentList" :key="i">
          <span class="comment-title">{{ item.articleTitle }}</span>
          <span class="comment-content">{{ item.comment }}</span>
        </li>
      </ul>
    </div>
  </el-card>
</template>
<script setup>
import BeatText from '@/components/BeatText'
import { reactive } from 'vue'

const commentList = reactive([
  {
    articleTitle: '10月27号、28号、29号、30四天PC端云音乐项目总结',
    comment: '浩：为什么没有啊，找一个小时了'
  },
  {
    articleTitle: '10月27号、28号、29号、30四天PC端云音乐项目总结',
    comment: '浩：为什么没有啊，找一个小时了'
  },
  {
    articleTitle: '10月27号、28号、29号、30四天PC端云音乐项目总结',
    comment: '浩：为什么没有啊，找一个小时了'
  },
  {
    articleTitle: '10月27号、28号、29号、30四天PC端云音乐项目总结',
    comment: '浩：为什么没有啊，找一个小时了'
  },
  {
    articleTitle: '10月27号、28号、29号、30四天PC端云音乐项目总结',
    comment: '浩：为什么没有啊，找一个小时了'
  }
])
</script>
<style lang="scss" scoped>
.comment-container {
  .comment-list {
    padding: 10px 0px;
    .comment-item {
      list-style: none;
      padding: 6px 0px;
      border-bottom: 1px solid var(--qz-admin-border-color);
      &:last-child {
        border-bottom: none;
        padding-bottom: 0px;
      }
      .comment-title {
        line-height: 22px;
        margin-bottom: 2px;
        color: #999aaa;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        cursor: pointer;
      }
      .comment-content {
        font-size: 14px;
        color: #555666;
        word-wrap: break-word;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        word-break: break-all;
      }
    }
  }
}
</style>

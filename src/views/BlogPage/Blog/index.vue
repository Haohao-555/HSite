<template>
  <el-row justify="center">
    <el-col :xs="24" :sm="24" :md="17" :lg="17" :xl="17">
      <!-- <Carousel-card /> -->
      <!-- 博客列表 -->
      <div class="blog-list">
        <Blog-card v-for="(blog, i) in blogList" :key="i" :blog="blog" />
      </div>
      <div class="pagination">
        <el-pagination small background layout="prev, pager, next" :total="50" />
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
      <Technology-info />
      <Time-info />
      <Comment-card />
      <Article-recommend-card />
    </el-col>
  </el-row>
</template>
<script setup>
import TechnologyInfo from './components/TechnologyInfo'
import TimeInfo from './components/TimeInfo'
import BlogCard from './components/BlogCard'
// import CarouselCard from './components/CarouselCard'
import CommentCard from './components/CommentCard'
// import ArticleRecommendCard from './components/ArticleRecommendCard'
import { reactive } from 'vue'

const blogList = reactive([
  {},
  {},
  {},
  {}
])
</script>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
}

.el-card {
  // background: hsla(0,0%,100%,.7) !important;
  margin: 10px 5px !important;
  border-radius: 12px;
}
</style>

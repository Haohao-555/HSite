<template>
  <el-card class="time">
    <div class="time-container">
      <div class="title" style="display: flex;">⏰ <beat-text text="时间沙漏"></beat-text></div>
      <div class="content">
        <div class="item" v-for="(item, i) in dayDate" :key="i">
            <div class="text" v-html="item.text"></div>
            <div class="process">
              <div class="finish" :style="{width: item.finshWidth}" v-html="item.finsh"></div>
            </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BeatText from '@/components/BeatText'
const dayDate = ref([])

// 获取当前月份多少天
const getCurrentMonthtoDay = time => {
  const month = time.getMonth() + 1
  const year = time.getFullYear()
  return new Date(year, month, 0).getDate()
}

const initTimeItem = () => {
  const data = []
  const time = new Date()
  const currentMonthDay = getCurrentMonthtoDay(time)

  const hour = time.getHours()
  const finishHour = (hour / 24).toFixed(2)
  data[0] = {}
  data[0].text = `今天已经过去<span>&nbsp; ${hour} &nbsp;</span>个小时`
  data[0].finsh = `<span>${(hour / 24 * 100).toFixed(0)}%</span>`
  data[0].finshWidth = `${finishHour * 100}%`

  const today = time.getDay() === 0 ? 7 : time.getDay()
  const finishToday = ((today - 1) / 7).toFixed(2)
  data[1] = {}
  data[1].text = `这周已经过去<span>&nbsp; ${(today - 1)} &nbsp;</span>天`
  data[1].finsh = `<span>${((today - 1) / 7 * 100).toFixed(0)}%</span>`
  data[1].finshWidth = `${finishToday * 100}%`

  const weeks = time.getDate() - 1
  const finishWeeks = (weeks / currentMonthDay).toFixed(2)
  data[2] = {}
  data[2].text = `本月已经过去<span>&nbsp; ${weeks} &nbsp;</span>天`
  data[2].finsh = `<span>${(weeks / currentMonthDay * 100).toFixed(0)}%</span>`
  data[2].finshWidth = `${finishWeeks * 100}%`

  const month = time.getMonth()
  const finishMonth = (month / 12).toFixed(2)
  data[3] = {}
  data[3].text = `本年已经过去<span>&nbsp; ${month} &nbsp;</span>个月`
  data[3].finsh = `<span>${(month / 12 * 100).toFixed(0)}%</span>`
  data[3].finshWidth = `${finishMonth * 100}%`

  dayDate.value = data
}
onMounted(() => {
  initTimeItem()
})
</script>
<style lang="scss" scoped>
.time {
  .time-container {
    .title {
      font-weight: bold;
      padding-bottom: 12px;
    }
    .content {
      font-size: 12px;
      .text {
        font-family: 'Microsoft YaHei';
        margin-bottom: 8px;
        ::v-deep span {
          color: var(--el-color-primary);
          font-weight: bolder;
          font-size: 14px;
        }
      }
      .process {
        position: relative;
        width: 98%;
        height: 12px;
        background-color: #ffffff;
        border-radius: 12px;
        margin-bottom: 8px;
        overflow: hidden;
        .finish {
          position: absolute;
          top: 0;
          left: 0;
          height: 12px;
          transition: width 1.2s;
          background-image: linear-gradient(-20deg, #d8f9b8 0%, var(--el-color-primary) 100%);
          border-bottom-right-radius: 12px;
          border-top-right-radius: 12px;
          ::v-deep span {
            position: absolute;
            right: 4px;
            font-size: 8px;
            color: #ffffff;
            font-weight: bold;
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>

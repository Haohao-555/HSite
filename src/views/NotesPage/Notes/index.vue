<template>
  <div class="home_page" v-loading="loading">
    <!-- 轮播图 -->
    <div class="bg_container">
      <bgBanner v-if="bannerList.length > 0" style="position: fixed; right: 0; left: 0" :bannerList="bannerList"
        :bgItem="bgItem" />
    </div>
    <!-- 头部 -->
    <el-affix>
      <div class="header">
        <div class="logo">
          <span class="logo_name">{{ site.logoTitle }}</span>
        </div>
        <div class="motto_title" v-if="!$store.getters.isMobile">
          <span>{{ site.motto }}</span>
        </div>
        <div class="right_nav">
          <div class="btn_group">
            <el-button class="btn" v-if="!isloginState" size="small" type="primary"
              @click="showLogin = true">登录</el-button>
            <el-button class="btn" v-if="!isloginState && !istourisloginState" size="small"
              :disabled="istourisloginState" @click="showTouristLogin = true">游客登录</el-button>
          </div>
          <SwitchDark v-if="istourisloginState || isloginState" />
          <div @click="toAdmin" v-if="+auth === 0">
            <svg-icon icon="admin" />
          </div>
          <Hamburger v-if="istourisloginState || isloginState || true" />
        </div>
      </div>
    </el-affix>
    <!-- 内容区域 -->
    <el-scrollbar height="91vh">
      <div :class="$store.getters.isMobile
        ? 'content_container'
        : 'content_container waterfall'
        " class="">
        <el-card v-if="site.notesCardContent" class="notes_card top_card">
          <div class="top">置顶</div>
          <div class="content_card" v-html="site.notesCardContent" />
          <el-button style="float: right;" type="text" v-if="+auth === 0"
            @click="onEditnotesCardContent()">编辑</el-button>
        </el-card>
        <el-card class="notes_card" v-for="(notes, key) in notesList" :key="key">
          <template #header>
            <el-tag v-if="notes.title" size="small" :type="notes.title.type ? notes.title.type : 'primary'">{{
              notes.title.content }}</el-tag>
            <div class="relative-time">
              <!-- <svg-icon class="timer-icon" icon="time"></svg-icon> -->
              {{ $filters.relativeTime(notes.createdAt) }}
              <el-button type="text" v-if="+auth === 0" @click="onEdit(notes)">编辑</el-button>
            </div>
          </template>
          <div class="imgList">
            <el-image v-for="(item, key) in notes.images" :key="key" loading="lazy" class="img-item" fit="cover"
              :src="item.url" :preview-src-list="notes.originImgUrl"></el-image>
          </div>
          <div class="content_card" v-html="notes.content"></div>
          <div class="time">
            {{ notes.createdAt }}
            <span style="margin-right: auto">{{
              notes.site ? '' : '（四跃初酒）'
            }}</span>
          </div>
          <div class="state">
            <el-tag v-if="notes.private" size="small" type="info">私有</el-tag>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
    <!-- 底部 -->
    <div class="footer" v-if="o_noteList.length != 0">
      <span>共 {{ o_noteList.length }} 篇日记 总字数 {{ textnum }}</span>
      <span>最近一次更新
        {{
          $filters.relativeTime(
            o_noteList[timerdesc ? 0 : o_noteList.length - 1].createdAt
          )
        }}</span>
    </div>
    <!-- 登录 / 游客登录 -->
    <el-dialog v-model="showDialog" width="80%" @close="closedialog">
      <Login v-if="showLogin" @submit="handleLogin" />
      <TouristLogin v-if="showTouristLogin" @sumbit="handleTouristLogin" />
      <template #footer>
        <el-button size="small" @click="closedialog">关闭</el-button>
      </template>
    </el-dialog>
    <!-- 设置 -->
    <el-drawer v-model="showDrawer" direction="rtl" :size="$store.getters.isMobile ? '60%' : '30%'" @close="closedrawer"
      title="# 设置 🔨">
      <div class="theme-container">
        <div class="theme" :class="$store.getters.mainColor === color ? 'active' : ''"
          :style="{ backgroundColor: color }" v-for="(color, i) in predefineColors" :key="i"
          @click="changeTheme(color)"></div>
      </div>
      <!-- <div class="timer_file">
        <el-divider content-position="left">日记排序设置</el-divider>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          日期倒序
          <el-switch v-model="timerdesc" @change="tiggertimerdesc" />
        </div>
      </div> -->
      <div class="bg_filter">
        <el-divider content-position="left"><el-switch v-if="!$store.getters.isMobile" size="small" v-model="showBanner"
            @change="tiggerBanner" />
          <span style="margin-left: 12px">照片墙</span>
        </el-divider>
        <div class="bg_list">
          <div v-for="(item, key) in bannerList" :key="key" class="bg_set"
            :style="{ backgroundImage: 'url(' + item.url + ')' }" :class="{ active: item.id === bgItem.id }"
            @click="triggerBg(item)" />
        </div>
      </div>
      <!--  <div class="state_filter">
        <el-divider content-position="left">日记状态设置</el-divider>
        <el-checkbox-group v-model="checkStateList" @change="changeFilter">
          <el-checkbox label="1"
            >只看公开{{ totalStateNotes(false) }}</el-checkbox
          >
          <el-checkbox label="2"
            >只看私有 {{ totalStateNotes(true) }}</el-checkbox
          >
        </el-checkbox-group>
      </div> -->
      <!-- <div class="title_filter">
        <el-divider content-position="left">日记标题设置</el-divider>
        <el-scrollbar height="300px">
          <el-checkbox-group v-model="checkTitleList" @change="changeFilter">
            <el-checkbox
              v-for="(item, i) in titleList"
              :key="i"
              :label="item.id"
              >{{ item.content || '无标题' }}
              {{ totalTitleNotes(item.id) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-scrollbar>
      </div> -->
    </el-drawer>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  getBanner,
  getNotes,
  isLogin,
  login,
  touristLogin,
  getSiteInfo
} from '@/api/home'
import { ElMessage, ElNotification } from 'element-plus'
import bgBanner from '@/components/bgbanner'
import Hamburger from '@/components/Hamburger'
import SwitchDark from '@/components/SwitchDark'
import Login from './components/Login'
import TouristLogin from './components/TouristLogin'
import { useTheme } from '@/hooks/useTheme'
import { setItem } from '@/utils/storage'
import { NOTE_MANAGE } from '@/constant'
const router = useRouter()
const { changePrimary } = useTheme()
const store = useStore()
const site = ref({})
const bannerList = ref([])
const bgItem = ref({})
const notesList = ref([])
const o_noteList = ref([])
const loading = ref(false)
const isloginState = ref(false)
const istourisloginState = ref(false)
const showLogin = ref(false)
const showTouristLogin = ref(false)
const titleList = ref([])
const checkTitleList = ref([])
// const checkStateList = ref(['1', '2'])
const textnum = ref(0)
const timerdesc = ref(true)
const auth = ref(1)
const showDialog = computed(() => showLogin.value || showTouristLogin.value)
const showBanner = computed(() => store.getters.showBanner)
const showDrawer = computed(() => store.getters.drawerSidebarOpened)

const predefineColors = [
  '#845EC2',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]
// const changeStateList = (data, value) => {
//   notesList.value = data.filter((item) => {
//     const state = item.private ? '2' : '1'
//     return value.includes(state)
//   })
// }
// const changeTitleList = (data, value) => {
//   notesList.value = data.filter((item) => {
//     const id = item.titleid ? item.titleid : -1
//     return value.includes(id)
//   })
// }
// const changeFilter = () => {
//   changeStateList(o_noteList.value, checkStateList.value)
//   changeTitleList(notesList.value, checkTitleList.value)
// }

const tiggerBanner = () => {
  store.commit('app/triggershowBanner')
}
const triggerBg = (item) => {
  bgItem.value = item
}
// const tiggertimerdesc = () => {
//   o_noteList.value = o_noteList.value.reverse()
//   changeFilter()
// }
// const totalTitleNotes = (id) => {
//   const data = o_noteList.value.filter((item) => {
//     if (id === -1) {
//       return !item.titleid
//     }
//     return item.titleid === id
//   })
//   if (id === -1) console.log('无标题', data)
//   return `（共 ${data.length} 篇）`
// }
// const totalStateNotes = (state) => {
//   const data = o_noteList.value.filter((item) => item.private === state)
//   return `（共 ${data.length} 篇）`
// }

const showWeclomeTip = ({
  title = '📚 欢迎来到我的日记站点',
  message = '请开始您的阅读，自己也可以记录一下 🚀'
} = {}) => {
  ElNotification({
    title,
    message,
    offset: 60
  })
}

const handleTitle = () => {
  // 处理标题
  const titlelist = []
  let findnoTitle = false
  notesList.value.forEach((item) => {
    if (item.title) {
      // 有标题
      const isFind = titlelist.find((title) => title.id === item.titleid)
      if (!isFind) {
        titlelist.push({
          id: item.titleid,
          type: item.title.type,
          content: item.title.content
        })
      }
    } else {
      findnoTitle = true
    }
  })
  if (findnoTitle) {
    titlelist.push({
      id: -1
    })
  }

  titleList.value = titlelist
  checkTitleList.value = titlelist.map((item) => item.id)
}

const handleTextSum = () => {
  // 计算总字数
  let sum = 0
  o_noteList.value.forEach((item) => {
    const content = item.content
    const chineseChars = content.match(/[\u4e00-\u9fa5]/g)
    const num = chineseChars ? chineseChars.length : 0
    sum += num
  })
  textnum.value = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getbanner = async () => {
  const res = await getBanner()
  if (res.errorno === 0) {
    bannerList.value = res.data.rows.map((item) => {
      item.url = item.originUrl
      item.style = !item.style ? {} : JSON.parse(item.style.replace(/\\/g, ''))
      return item
    })
    const bgitem =
      bannerList.value.find((item) => item.top) || bannerList.value[0]
    bgitem.style.height = '100vh'
    bgItem.value = bgitem
  }
}

const getnotes = async () => {
  loading.value = true
  const res = await getNotes({
    site: 'notes_pro'
  })
  if (res.errorno !== 0) {
    ElMessage({
      message: res.message,
      type: 'warning'
    })
  } else {
    notesList.value = res.data.rows
    o_noteList.value = res.data.rows
    handleTextSum()
  }
  loading.value = false

  handleTitle()
}

const getsiteInfo = async () => {
  const res = await getSiteInfo()
  if (res.errorno === 0) {
    site.value = res.data
  }
}

const handleLogin = async (params) => {
  const res = await login(Object.assign(params, { site: 'notes_pro' }))
  if (res.errorno === 0) {
    showLogin.value = false
    isloginState.value = true
    getnotes()
    showWeclomeTip()
  } else {
    ElMessage({
      message: res.message,
      type: 'error'
    })
  }
}

const handleTouristLogin = async (params) => {
  params = Object.assign(params, { site: 'notes_pro' })
  const res = await touristLogin(params)
  if (res.errorno === 0) {
    notesList.value = res.data.rows
    o_noteList.value = res.data.rows
    showWeclomeTip({
      message: '请开始您的阅读（仅读取站主公开的日记）'
    })
    handleTitle()
    handleTextSum()
    showTouristLogin.value = false
    istourisloginState.value = true
  } else {
    ElMessage({
      message: res.message,
      type: 'error'
    })
  }
}

const islogin = async () => {
  const res = await isLogin()
  res.errorno !== 0 ? (isloginState.value = false) : (isloginState.value = true)
  if (isloginState.value) {
    showWeclomeTip()
    auth.value = res.data.auth
  }
}

const changeTheme = (color) => {
  store.commit('theme/setMainColor', color)
  changePrimary(color)
}

const closedialog = () => {
  showTouristLogin.value = false
  showLogin.value = false
}

const closedrawer = () => {
  store.commit('app/triggerSidebarOpened')
}

const toAdmin = () => {
  router.push({
    path: '/nmanage/manageNote'
  })
}

const onEdit = (row) => {
  setItem(NOTE_MANAGE, { id: [row.id] })
  router.push({
    path: '/nmanage/manageNote'
  })
}

const onEditnotesCardContent = () => {
  router.push({
    path: '/nmanage/baseinfo'
  })
}

onMounted(() => {
  getbanner()
  getnotes()
  islogin()
  getsiteInfo()
})
</script>
<style lang="scss" scoped>
.home_page {
  position: relative;
  font-family: 'alimama';

  .bg_container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    z-index: -1;
  }

  .header {
    height: 40px;
    padding-right: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      display: flex;
      height: 100%;
      align-items: center;
      vertical-align: middle;
      font-size: 12px;

      .logo_name {
        font-weight: 500;
        margin-left: 12px;
      }
    }

    .motto_title {
      color: var(--el-color-primary);
    }

    .right_nav {
      display: flex;
      align-items: center;
      font-size: 20px;
      gap: 6px;

      .svg-icon {
        display: block;
        cursor: pointer;
      }

      .btn_group {
        .btn {
          margin-right: 6px;
          margin-left: 0px;
        }
      }

      .switch {
        margin-top: 0px;
        margin-right: 6px;
      }

      .hamburger-container {
        padding-right: 0px;
        padding-left: 0px;
      }
    }
  }

  .content_container {
    width: 99%;
    padding: 6px 6px 0px 6px;
    margin: auto;
    // padding: 20px 12px 6px 12px;
    box-sizing: border-box;

    // min-height: 100vh;
    &.waterfall {
      column-count: 4;
      column-gap: 6px;
    }

    .notes_card {
      position: relative;
      padding: 12px;
      box-sizing: border-box;
      margin-bottom: 12px;
      line-height: 26px;
      font-size: 14px;
      text-align: justify;
      border-radius: 4px;
      background: var(--notes-card-bg-color);

      &.top_card {
        padding-top: 30px;
      }

      .top {
        position: absolute;
        right: -32px;
        top: -7px;
        padding-top: 4px;
        padding-bottom: 4px;
        width: 80px;
        height: 40px;
        line-height: 50px;
        background-color: var(--el-color-primary);
        text-align: center;
        font-size: 14px;
        color: #fff;
        transform: rotate(45deg);
      }

      ::v-deep .el-card__header {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        padding-bottom: 0px;
        border-bottom: none;
      }

      .imgList {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 12px;

        .img-item {
          border-radius: 4px;
          aspect-ratio: 1;
        }
      }

      .time {
        width: 100%;
        line-height: 40px;
        color: var(--el-color-primary);
        display: flex;
      }

      .relative-time {
        margin-left: auto;
        color: var(--el-color-primary);
      }

      .state {
        padding-top: 12px;
        display: flex;
        justify-content: end;
      }
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    padding-top: 6px;
    text-align: center;
    color: var(--el-color-primary);
  }
}

.bg_list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 两列 */
  grid-gap: 10px;

  /* 可选项，设置单元格之间的间隙 */
  .bg_set {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    height: 80px;
    border-radius: 3px;
    border: 2px solid transparent;
    cursor: pointer;

    &.active {
      border-color: var(--el-color-primary);
    }
  }
}

.theme-container {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  .theme {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;

    &.active {
      border-color: var(--qz-admin-text-color);
    }
  }
}

::v-deep .el-dialog__body {
  padding-bottom: 0px;
}

::v-deep .el-dialog__footer {
  padding-top: 0px;
}

::v-deep .el-loading-mask {
  background-color: transparent;
}

::v-deep .el-drawer__body {
  padding-top: 0px;
}
</style>

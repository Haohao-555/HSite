import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { islogin } from '@/api/admin'
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

const whiteList = ['/notes', '/404', '/blog', '/blogcontent']
// 路由鉴权
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const res = await islogin()
  const loginState = res.errorno === 0

  if (to.path === '/login') {
    // 已登录：直接进入到管理平台
    loginState ? next('/nmanage') : next()
  } else {
    if (!loginState) {
      const isWhite = whiteList.includes(to.path)
      isWhite ? next() : next('/login')
    }
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

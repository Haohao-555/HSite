import { onMounted, onBeforeUnmount } from 'vue'
import store from '@/store'

export const useIsMobile = () => {
  const isMobile = () => {
    const regex =
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    const state = regex.test(navigator.userAgent)
    store.commit('app/changeIsMobile', state)
    if (state) {
      store.commit('app/changeSidebarOpened', false)
    }
  }

  onMounted(() => {
    isMobile()
    window.removeEventListener('resize', isMobile)
    window.addEventListener('resize', isMobile)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', isMobile)
  })
}

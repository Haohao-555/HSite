import request from '@/utils/require'

// 获取轮播图
export const getBanner = (data) => {
  return request({
    url: '/getBanner',
    method: 'get',
    data
  })
}

// 获取日记
export const getNotes = (data) => {
  return request({
    url: '/getNotes',
    method: 'post',
    data
  })
}

// 是否登录
export const isLogin = (data) => {
  return request({
    url: '/isLogin',
    method: 'post',
    data
  })
}

// 登录
export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 游客登录
export const touristLogin = (data) => {
  return request({
    url: '/touristLogin',
    method: 'post',
    data
  })
}

// 获取站点信息
export const getSiteInfo = () => {
  return request({
    url: '/getSite',
    method: 'get'
  })
}

// 获取所有标题
export const getTitle = () => {
  return request({
    url: '/getTitle',
    method: 'post'
  })
}

export const createNote = (data) => {
  return request({
    url: '/createNotes',
    method: 'post',
    data
  })
}

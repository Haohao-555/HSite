import request from '@/utils/require'

// 登录
export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 判断是否登录
export const islogin = () => {
  return request({
    url: '/admin/islogin',
    method: 'post'
  })
}

// 更新站点信息
export const updateSite = (data) => {
  return request({
    url: '/admin/updateSite',
    method: 'post',
    data
  })
}

export const getNotesList = (data) => {
  return request({
    url: '/admin/getNotesList',
    method: 'post',
    data
  })
}

export const createTitle = (data) => {
  return request({
    url: '/admin/createTitle',
    method: 'post',
    data
  })
}

export const editTitle = (data) => {
  return request({
    url: '/admin/editTitle',
    method: 'post',
    data
  })
}

export const delTitle = (data) => {
  return request({
    url: '/admin/delTitle',
    method: 'post',
    data
  })
}

export const delNotes = (data) => {
  return request({
    url: '/admin/delNotes',
    method: 'post',
    data
  })
}

export const updateNote = (data) => {
  return request({
    url: '/admin/updateNote',
    method: 'post',
    data
  })
}

export const getBanner = () => {
  return request({
    url: '/admin/getBanner',
    method: 'get'
  })
}

export const updateBanner = (data) => {
  return request({
    url: '/admin/updateBanner',
    method: 'post',
    data
  })
}

export const saveBanner = (data) => {
  return request({
    url: '/admin/saveBanner',
    method: 'post',
    data: data
  })
}

export const delBanner = (data) => {
  return request({
    url: '/admin/deleteBanner',
    method: 'post',
    data: data
  })
}

export const getResumeBase = () => {
  return request({
    url: '/admin/getResumeBase',
    method: 'get'
  })
}

export const updateResumeBase = (data) => {
  return request({
    url: '/admin/updateResumeBase',
    method: 'post',
    data: data
  })
}

export const saveResumBase = (data) => {
  return request({
    url: '/admin/saveResumBase',
    method: 'post',
    data: data
  })
}

export const getResumeEduc = () => {
  return request({
    url: '/admin/getResumeEduc',
    method: 'get'
  })
}

export const saveResumeEduc = (data) => {
  return request({
    url: '/admin/saveResumeEduc',
    method: 'post',
    data
  })
}

export const updateResumeEduc = (data) => {
  return request({
    url: '/admin/updateResumeEduc',
    method: 'post',
    data
  })
}

export const deleteResumeEduc = (data) => {
  return request({
    url: '/admin/deleteResumeEduc',
    method: 'post',
    data
  })
}

export const saveResumeWork = (data) => {
  return request({
    url: '/admin/saveResumeWork',
    method: 'post',
    data
  })
}
export const updateResumeWork = (data) => {
  return request({
    url: '/admin/updateResumeWork',
    method: 'post',
    data
  })
}
export const getResumeWork = () => {
  return request({
    url: '/admin/getResumeWork',
    method: 'get'
  })
}
export const deleteResumeWork = (data) => {
  return request({
    url: '/admin/deleteResumeWork',
    method: 'post',
    data
  })
}

export const updateResumeSkill = async (data) => {
  return request({
    url: '/admin/updateResumeSkill',
    method: 'post',
    data
  })
}

export const deleteResumeSkill = async (data) => {
  return request({
    url: '/admin/delResumeSkill',
    method: 'post',
    data
  })
}

export const saveResumeSkill = async (data) => {
  return request({
    url: '/admin/saveResumeSkill',
    method: 'post',
    data
  })
}

export const getResumeSkill = async () => {
  return request({
    url: '/admin/getResumeSkill',
    method: 'get'
  })
}

export const getHistorytodayNotes = async () => {
  return request({
    url: '/admin/getHistorytodayNotes',
    method: 'post'
  })
}

export const getAccountList = async () => {
  return request({
    url: '/admin/getAccountList',
    method: 'post'
  })
}

export const updateAccount = async (data) => {
  return request({
    url: '/admin/updateAccount',
    method: 'post',
    data
  })
}

export const delAccount = async (data) => {
  return request({
    url: '/admin/delAccount',
    method: 'post',
    data
  })
}

export const addAccount = async (data) => {
  return request({
    url: 'admin/addAccount',
    method: 'post',
    data
  })
}

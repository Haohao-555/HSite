import { } from 'vue'
import request from '@/utils/require'
export const useTable = ({
  init,
  url,
  method = 'POST',
  params
}) => {
  // 获取数据
  const getTableData = (params) => {
    return request({
      url: url,
      method: method,
      data: params
    })
  }

  return {
    getTableData
  }
}

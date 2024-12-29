export const getNotesauth = (row) => {
  /**
   * !超级管理员：都可看
   * !游客：!row.title.private && !row.private 都为 true ：可看
   * !账号：row.title.private 为 false：可看
   */
  const auth = {
    superAdmin: true,
    tourist: !row.title.private && !row.private,
    account: !row.title.private,
    site: row.site
  }
  return auth
}

export const getRecentDateRange = (rangeType) => {
  let endDate = new Date() // 当前日期为结束日期
  let startDate

  switch (rangeType) {
    case 'today':
      startDate = endDate
      break
    case 'yesterday':
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000) // 当前日期减去1天
      endDate = startDate // `yesterday` 的结束日期也是减去1天的日期
      break
    case 'week':
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 当前日期减去7天
      break
    case 'month':
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 当前日期减去30天
      break
    case 'year':
      startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000) // 当前日期减去365天
      break
    default:
      throw new Error('Invalid range type. Please use "week", "month", or "year".')
  }

  // 将日期格式化为 'YYYY-MM-DD' 格式
  const formatDate = (date) => date.toISOString().split('T')[0]

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  }
}

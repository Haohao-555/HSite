import { watch, ref, toRaw } from 'vue'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import ExportWorker from './export.worker.js'
export const useTable = ({
  // 默认显示的字段
  defaultColumn,
  // 所有字段
  column,
  // 请求数据方法
  fetchApi,
  // 是否有分页器
  hasPagination,
  // 保存 showColumnKey
  showColumnKey
}) => {
  const selectionRows = ref([])
  const showColumn = ref([])
  const columnList = ref([])
  const tableData = ref([])
  const total = ref(0)
  const pageNum = ref(0)
  const pageSize = ref(0)
  const loading = ref(false)
  const uploading = ref(false)
  const storageKey = ref(showColumnKey)

  // *监听 defaultColumn 是否发生变化，避免异步修改 defaultColumn 导致监听不到
  watch(
    () => defaultColumn.value,
    (val) => {
      showColumn.value = toRaw(val)
      if (storageKey.value) localStorage.setItem(storageKey.value, val)
    },
    {
      immediate: true,
      deep: true
    }
  )

  // *监听 column 是否发生变化，避免异步修改 column 导致监听不到
  watch(
    () => column.value,
    (val) => {
      columnList.value = toRaw(val)
    },
    {
      immediate: true,
      deep: true
    }
  )

  /**
   * 获取表格数据
   * @param {Object} params 上层传递的请求参数
   */
  const getTableData = async (params = {}) => {
    loading.value = true
    const {
      data,
      pageNum: num,
      pageSize: size,
      total: sum
    } = await fetchApi(params)

    tableData.value = data
    if (hasPagination) {
      pageNum.value = num
      pageSize.value = size
      total.value = sum
    }
    loading.value = false
  }

  /**
   * 索引方法（配合 vhTable 或 elTable 进行使用）
   * @param {Number} index 下标
   * @returns 当前行处理后的下标
   */
  const indexMethod = (index) => {
    if (!hasPagination) return index + 1
    const pageIndex = pageNum.value - 1 < 0 ? 0 : pageNum.value - 1
    return index + 1 + pageIndex * pageSize.value
  }

  /**
   * 选中行（配合 vhTable 或 elTable 进行使用）
   * @param {Object} rows 被选中的行
   */
  const onSelectionChange = (rows) => {
    selectionRows.value = toRaw(rows)
  }

  /**
   * 选中展示的列（配合 ColumnSelect 进行使用）
   * @param {Array} propList 被展示的列
   */
  const columnChange = (propList) => {
    showColumn.value = propList
  }

  /**
   * 根据 ColumnList 配置将数据进行转换
   * @param {Array || Object} rowList 数据（必填）
   * @param {Array} columnMap 配置信息
   * @returns 经过转换的数据
   */
  const transitionRow = (rowList, columnMap) => {
    if (!Array.isArray(rowList) && typeof rowList === 'object') rowList = [rowList]

    if (!columnMap) columnMap = getColumnMapConfig(false)

    const data = rowList.map(row => {
      const exportItem = Object.keys(columnMap).reduce((acc, cur) => {
        const customValueFunc = columnMap[cur].value
        acc[cur] = row[cur]

        if (typeof customValueFunc === 'function') acc[cur] = customValueFunc(row, cur)
        return acc
      }, {})
      return exportItem
    })

    return data
  }

  /**
   * 获取导出的列配置信息
   * @param {Boolean} isAllColumn 是否为所有列
   * @returns 列 Map
   */
  const getColumnMapConfig = (isAllColumn = false) => {
    const columnMap = columnList.value.filter(column => isAllColumn ? true : showColumn.value.includes(column.prop)).reduce((acc, cur) => {
      acc[cur.prop] = cur
      return acc
    }, {})

    return columnMap
  }

  /**
   * 生成符合要求的 Excel 数据
   * @param {Array} data 数据
   * @param {Array} isAllColumn 是否需要导出所有字段
   * @returns 符合 Excel 要求的数据
   */
  const generateExcelData = (data, isAllColumn) => {
    const columnMap = getColumnMapConfig(isAllColumn)

    const csvHeader = Object.keys(columnMap).map(key => {
      return {
        width: 30,
        key: key,
        header: typeof columnMap[key].label === 'function' ? columnMap[key].label(columnMap[key]) : columnMap[key].label
      }
    })

    const csvData = transitionRow(data, columnMap)

    return {
      csvData,
      csvHeader
    }
  }

  const exportDataByType = (config) => {
    const { csvHeader, csvData, fileName, isOpenWorker } = config

    // TODO 需要考虑一下 type

    if (isOpenWorker) {
      exportDataToXLSXByWorker(csvHeader, csvData, fileName)
    } else {
      exportDataToXLSX(csvHeader, csvData, fileName)
    }
  }

  /**
   * 导出所有数据
   * @param {String} fileName 文件名
   * @param {Array} data 数据
   * @param {Boolean} isOpenWorker 是否开启子进程
   */
  const exportAllData = async (
    fileName = 'exportAllData',
    isOpenWorker = false,
    isAllColumn = false,
    type = 'excel'
  ) => {
    const {
      data
    } = await fetchApi({
      pageSize: total.value,
      pageNum: 0
    })

    if (data.length === 0) return

    const { csvHeader, csvData } = generateExcelData(data, isAllColumn)

    // 导出数据
    exportDataByType({
      type,
      csvHeader,
      csvData,
      isOpenWorker,
      fileName
    })
  }

  /**
   * 导出选中数据
   * @param {String} filename 文件名
   * @param {Boolean} isOpenWorker 是否开启子进程
   */
  const exportSelectedData = (
    fileName = 'exportSelectedData',
    isOpenWorker = false,
    isAllColumn = false,
    type = 'excel'
  ) => {
    if (selectionRows.value.length === 0) return

    const { csvHeader, csvData } = generateExcelData(selectionRows.value, isAllColumn)

    // 导出数据
    exportDataByType({
      type,
      csvHeader,
      csvData,
      isOpenWorker,
      fileName
    })
  }

  /**
   * 导出数据为 XLSX
   * @param {Object} csvHeader XLSX 头
   * @param {Array} csvData 数据
   * @param {String} filename 文件名
   */
  const exportDataToXLSX = (csvHeader, csvData, filename) => {
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('My Sheet')
    worksheet.columns = csvHeader
    csvData.forEach(row => worksheet.addRow(row))
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), `${filename}.xlsx`)
    })
  }

  /**
   * 导出数据为 XLSX（通过 web Worker）
   * @param {Object} csvHeader XLSX 头
   * @param {Array} csvData 数据
   * @param {String} filename 文件名
   */
  const exportDataToXLSXByWorker = (csvHeader, csvData, filename) => {
    const worker = new ExportWorker()

    // * 判断 csvData 中的值是否存在对象，需要序列化处理
    const keys = csvHeader.map(item => item.key)
    csvData = csvData.map(row => {
      return keys.reduce((acc, prev) => {
        acc[prev] = typeof row[prev] === 'object' ? JSON.stringify(row[prev]) : row[prev]
        return acc
      }, {})
    })

    worker.postMessage({
      csvData: csvData,
      csvHeader: csvHeader
    })

    worker.onmessage = async(e) => {
      const { chunk: blog } = e.data
      saveAs(blog, filename)
    }
  }

  /**
   *  删除 localStorage 的 showProps
   * @param {String} key storage key 值
   */
  const delShowColumnStorage = (key = storageKey.value) => {
    localStorage.removeItem(key)
  }

  return {
    uploading,
    loading,
    tableData,
    showColumn,
    columnList,
    selectionRows,
    getTableData,
    indexMethod,
    exportAllData,
    exportSelectedData,
    onSelectionChange,
    delShowColumnStorage,
    columnChange,
    transitionRow,
    exportDataByType
  }
}

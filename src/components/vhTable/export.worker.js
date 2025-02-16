import Excel from 'exceljs'
import JSZip from 'jszip'
self.onmessage = async function(e) {
  const iszip = e.data.iszip
  let data = e.data.excel || []
  if (!iszip) data = [data[0]]
  const excelBufferList = []
  await Promise.all(data.map(async (item, i) => {
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('My Sheet')
    const { csvData, csvHeader, fileName = 'file' } = item

    worksheet.columns = csvHeader

    // 添加数据行
    csvData.forEach(row => worksheet.addRow(row))

    // 生成 Buffer
    const buffer = await workbook.xlsx.writeBuffer()
    excelBufferList.push({ fileName, buffer })
  }))

  let blobContent = ''
  if (iszip) {
    const zip = new JSZip()
    excelBufferList.forEach((item) => {
      const { fileName, buffer } = item
      zip.file(`${fileName}.xlsx`, buffer)
    })
    blobContent = await zip.generateAsync({ type: 'blob' })
  } else {
    const buffer = excelBufferList[0].buffer
    blobContent = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  self.postMessage({ chunk: blobContent, iszip })
}

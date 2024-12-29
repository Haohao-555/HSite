import Excel from 'exceljs'

self.onmessage = async function(e) {
  const { csvData, csvHeader } = e.data

  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('My Sheet')

  worksheet.columns = csvHeader
  csvData.forEach(row => worksheet.addRow(row))

  // 生成 Excel 文件的 Buffer
  const excelBuffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  self.postMessage({ chunk: blob })
}

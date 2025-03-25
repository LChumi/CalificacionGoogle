import * as XLSX from 'xlsx';

export function converToExcel(data: any, docName: any): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']}
  XLSX.writeFile(workbook, docName + '.xlsx')
}

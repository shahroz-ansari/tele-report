import * as XLSX from "xlsx";
export const parseMonthRows = function (workbook, sheets, month, year) {
  let finalRows = [];
  sheets.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { raw: false }); // 2D array
    rows.forEach((row) => {
      if (row.Date) {
        const date = new Date(row.Date);
        if (date.getFullYear() === year && (date.getMonth() + 1) === month) {
          finalRows.push(row);
        }
      }
    });
  });
  return finalRows;
};

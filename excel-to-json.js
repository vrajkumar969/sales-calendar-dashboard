const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// FILE PATHS
const excelFile = path.join(__dirname, "data", "sales.xlsx");
const jsonFile  = path.join(__dirname, "data", "sales.json");

// READ EXCEL
const workbook = XLSX.readFile(excelFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// CONVERT TO JSON
const rows = XLSX.utils.sheet_to_json(sheet);

// OUTLET COLUMNS
const outlets = [
  "Chetak Circle",
  "Mali Colony",
  "Maple",
  "Gurukul",
  "Vastrapur"
];

// TRANSFORM STRUCTURE
const output = rows.map(row => {
  const [dd, mm, yyyy] = row.Date.split("-");

  const outletData = {};
  outlets.forEach(o => outletData[o] = Number(row[o] || 0));

  return {
    date: `${yyyy}-${mm}-${dd}`,
    outlets: outletData
  };
});

// WRITE JSON
fs.writeFileSync(jsonFile, JSON.stringify(output, null, 2));

console.log("✅ sales.json updated successfully!");

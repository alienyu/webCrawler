const path = require("path");
const getNameInfo = require("./getNameInfo");
const genByBitExcelFile = require("../common").genByBitExcelFile;
var excelFilePath = path.join(__dirname, "区块链名词解释.csv");

async function generateNameInfoExcel() {
    var startTime = new Date().getTime();
    var nameList = await getNameInfo();
    genByBitExcelFile(nameList, excelFilePath)
    var endTime = new Date().getTime();
    console.log(`总耗时：${(endTime - startTime)/1000}秒`);
}

generateNameInfoExcel(excelFilePath);

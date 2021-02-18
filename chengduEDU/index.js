const path = require("path");
const getSchoolInfo = require("./getSchoolInfo");
const genExcelFile = require("../common").genExcelFile;
var defaultTotalPages = 1000; //默认总页码；
var excelFilePath = path.join(__dirname, "成都学校信息.csv");

async function generateSchoolInfoExcel(defaultTotalPages) {
    var startTime = new Date().getTime();
    var schoolList = await getSchoolInfo(defaultTotalPages);
    console.log('总条数：', schoolList.length)
    genExcelFile(schoolList, excelFilePath)
    var endTime = new Date().getTime();
    console.log(`总耗时：${(endTime - startTime)/1000}秒`);
}

generateSchoolInfoExcel(defaultTotalPages, excelFilePath);

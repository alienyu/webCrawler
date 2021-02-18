const path = require("path");
const getSchoolInfo = require("./getSchoolInfo");
const genExcelFile = require("../common").genExcelFile;
var defaultTotalPages = 1; //默认总页码；
var excelFilePath = path.join(__dirname, "成都学校信息.csv");

async function generateSchoolInfoExcel(defaultTotalPages) {
    var schoolList = await getSchoolInfo(defaultTotalPages);
    console.log('schoolList', schoolList)
    console.log('length', schoolList.length)
    genExcelFile(schoolList, excelFilePath)
}

generateSchoolInfoExcel(defaultTotalPages, excelFilePath)
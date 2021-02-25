const path = require("path");
const getSchoolInfo = require("./getSchoolInfo");
const genGuangdongExcelFile = require("../common").genGuangdongExcelFile;
var cityCode = 4453;
var region = '云浮市';
var startPage = 1; //开始页码
var endPage = 57; //结束页码；
var excelFilePath = path.join(__dirname, "广东学校信息.csv");

async function generateSchoolInfoExcel(start, end, cityCode, region, excelFilePath) {
    var startTime = new Date().getTime();
    var schoolList = await getSchoolInfo(start, end, cityCode, region);
    // console.log('schoolList', schoolList)
    console.log('总条数：', schoolList.length)
    genGuangdongExcelFile(schoolList, excelFilePath)
    var endTime = new Date().getTime();
    console.log(`总耗时：${(endTime - startTime)/1000}秒`);
}

generateSchoolInfoExcel(startPage, endPage, cityCode, region, excelFilePath);

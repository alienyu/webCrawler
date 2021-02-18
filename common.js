const request = require("request");
const fs = require("fs");

handleRequestByPromise = options => {
    let op = Object.assign(
      {},
      {
        url: "",
        method: "GET",
        encoding: null,
        header: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
          Referer: "https://www.baidu.com"
        }
      },
      options
    );
  
    if (op.url === "") {
      throw new Error("请求的url地址不正确");
    }
  
    const promise = new Promise(function(resolve, reject) {
      request(op, (err, response, body) => {
        if (err) reject(err);
  
        if (response && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(`请求失败`);
        }
      });
    });

  return promise;
}

genExcelFile = (data, file) => {
    var keyList = ["name", "type", "address", "postalCode", "principal", "creater", "artificialPerson", "phone", "mobile", "email", "link"]
    var csvText = "学校名称, 学校类别/学段（指是幼儿园、小学、初中、高中还是培训机构 ）, 地址, 邮编, 校长, 举办者, 法人代表, 电话, 手机, 邮箱, 网址\n";
    data.map(eachLine => {
        keyList.map((key, index) => {
            if(index != 10) {
                csvText += `"${eachLine[key]}",`
            } else {
                csvText += `"${eachLine[key]}"\n`
            }
        })
    })
    fs.writeFileSync(file, csvText);
}

module.exports = {
    handleRequestByPromise,
    genExcelFile
};
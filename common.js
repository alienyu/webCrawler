const request = require("request");
const fs = require("fs");

handleRequestByPromise = options => {
  let op = Object.assign(
    {},
    {
      url: "",
      method: "GET",
      encoding: null,
      timeout: 500,
      header: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        Referer: "http://xxpt.gdedu.gov.cn"
      }
    },
    options
  );

  if (op.url === "") {
    throw new Error("请求的url地址不正确");
  }

  const promise = new Promise(function (resolve, reject) {
    request(op, (err, response, body) => {
      if (response && response.statusCode === 200) {
        resolve(body);
      } else {
        reject('err');
      }
    });
  });

  return promise;
}

readFileSync = path => {
  var fileStr = fs.readFileSync(path, { encoding: 'utf8' });
  return fileStr
}

genExcelFile = (data, file) => {
  var keyList = ["name", "type", "address", "postalCode", "principal", "creater", "artificialPerson", "phone", "mobile", "email", "link"]
  var csvText = "学校名称, 学校类别/学段（指是幼儿园、小学、初中、高中还是培训机构 ）, 地址, 邮编, 校长, 举办者, 法人代表, 电话, 手机, 邮箱, 网址\n";
  data.map(eachLine => {
    keyList.map((key, index) => {
      if (index != 10) {
        csvText += `"${eachLine[key]}",`
      } else {
        csvText += `"${eachLine[key]}"\n`
      }
    })
  })
  fs.writeFileSync(file, csvText);
}

genGuangdongExcelFile = (data, file) => {
  var keyList = ["region", "name", "address", "phone", "code", "type", "creater"]
  var csvText = "所属城市, 学校名称, 机构地址, 联系电话, 学校代码, 学校性质, 举办者\n";
  data.map(eachLine => {
    keyList.map((key, index) => {
      if (index != 6) {
        csvText += `"${eachLine[key]}",`
      } else {
        csvText += `"${eachLine[key]}"\n`
      }
    })
  })
  fs.writeFileSync(file, csvText);
}

genByBitExcelFile = (data, file) => {
  var csvText = "首字母, 词组, 释义\n";
  Object.keys(data).map(firstAlp => {
    Object.keys(data[firstAlp]).map(eachWord => {
      var desc = data[firstAlp][eachWord];
      csvText += `"${firstAlp}", "${eachWord}", "${desc}"\n`;
    });
  });
  fs.writeFileSync(file, csvText);
}

module.exports = {
  handleRequestByPromise,
  genExcelFile,
  genGuangdongExcelFile,
  readFileSync,
  genByBitExcelFile
};
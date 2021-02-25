const cheerio = require('cheerio');

const handleRequestByPromise = require("../common").handleRequestByPromise;
const config = require("./config");
const { domain, webPage } = config;
const wholeWebPath = `${domain}${webPage}`


//判断当前页码是否存在
judgePageExist = $ => {
    return $("tbody tr").length > 1 ? true : false;
}

async function getSchoolInfo(start, end, cityCode, region) {
    var schoolInfo = [];
    var judgeSign = true;
    for(var i = start;i <= end;i++) {
        if(!judgeSign){break;}
        var curUrl = `${wholeWebPath}&dq_m=${cityCode}&page=${i}`;
        //获取当页的html内容
        try {
            var body = await handleRequestByPromise({ url: curUrl });
            var $ = cheerio.load(body);
            var judgeSign = judgePageExist($);
            if(judgeSign) {
                var schoolList = $("tbody tr"); 
                schoolList.splice(0,1); // 当页所有学校
                schoolList.map((index, dom) => {
                    var tdList = $(dom).find("td");
                    if(tdList.eq(5).text() == "民办") {
                        var info = {
                            region,
                            name: "",
                            type: "",
                            address: "",
                            phone: "",
                            creater: "民办",
                            code: "",
                        };
                        info.name = tdList.eq(0).text();
                        info.address = tdList.eq(1).text();
                        info.phone = tdList.eq(2).text();
                        info.code = tdList.eq(3).text();
                        info.type = tdList.eq(4).text();
                        schoolInfo.push(info);
                    }
                });
                console.log('successUrl', curUrl);
            } else { break; }
        } catch(e) {
            console.log('failUrl', curUrl);
            i --;
        }
    }
    return schoolInfo;
}

module.exports = getSchoolInfo;

const cheerio = require('cheerio');

const handleRequestByPromise = require("../common").handleRequestByPromise;
const config = require("./config");
const { domain, webPage } = config;
const wholeWebPath = `${domain}${webPage}`


//判断当前页码是否存在
judgePageExist = $ => {
    return $(".quotes p").length > 0 ? true : false;
}

mapInfo = text => {
    if(text.match(/学段/)) {
        return 'type';
    } else if(text.match(/地址/)) {
        return 'address';
    } else if(text.match(/电话/)) {
        if(text.match(/-/)) {
            return 'phone';
        } else { return 'mobile' }
    } else { return null;}
}

async function getSchoolInfo(defaultTotalPages) {
    var schoolInfo = [];
    for(var i = 0;i < defaultTotalPages;i ++) {
        var curPage = i + 1; //当前页码
        var curUrl = `${wholeWebPath}&pages=${curPage}`;
        //获取当页的html内容
        var body = await handleRequestByPromise({ url: curUrl });
        var $ = cheerio.load(body);
        if(judgePageExist($)) {
            var schoolList = $(".index1").eq(1).find("li"); // 当页所有学校
            schoolList.map((index, dom) => {
                var info = {
                    link: "",
                    name: "",
                    type: "",
                    address: "",
                    phone: "",
                    mobile: "",
                    postalCode: "",
                    principal: "",
                    creater: "",
                    artificialPerson: "",
                    email: "",
                }
                var link = `${domain}${$(dom).find("a").attr("href")}`;
                var name = $(dom).find("a h1").text();
                info.link = link;
                info.name = name;
                var detailDom = $(dom).find(".text_div");
                detailDom.find("p").map((subIndex, detailDom) => {
                    var key = mapInfo($(detailDom).text());
                    if(key) {
                        var content = $(detailDom).text().split("】")[1].replace(/\s/g, "");
                        info[key] = content;
                    }
                })
                schoolInfo.push(info);
            })
        } else { break; }
    }
    return schoolInfo;
}

module.exports = getSchoolInfo;

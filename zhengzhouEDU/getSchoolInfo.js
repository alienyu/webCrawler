const cheerio = require('cheerio');

const handleRequestByPromise = require("../common").handleRequestByPromise;
const config = require("./config");
const { domain, webPage } = config;
const wholeWebPath = `${domain}${webPage}`


//判断当前页码是否存在
judgePageExist = $ => {
    return $(".container>.yahei").length > 0 ? true : false;
}

mapInfo = text => {
    if(text.match(/学校类别/)) {
        return 'type';
    } else if(text.match(/地址/)) {
        return 'address';
    } else if(text.match(/校长/)) {
        return 'principal';
    } else if(text.match(/举办者/)) {
        return 'creater';
    } else if(text.match(/法定代表人/)) {
        return 'artificialPerson';
    } else { return null;}
}

async function getSchoolInfo(defaultTotalPages) {
    var schoolInfo = [];
    var judgeSign = true;
    for(var i = 170;i < defaultTotalPages;i++) {
        if(!judgeSign){break;}
        var curPage = i + 1; //当前页码
        var curUrl = `${wholeWebPath}&PageIndex=${curPage}`;
        //获取当页的html内容
        var body = await handleRequestByPromise({ url: curUrl });
        var $ = cheerio.load(body);
        var judgeSign = judgePageExist($);
        if(judgeSign) {
            var schoolList = $(".container>.yahei"); // 当页所有学校
            var schoolListLen = schoolList.length;
            for(var j = 0;j < schoolListLen; j++) {
                var dom = schoolList[j];
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
                var link = $(dom).find('a').attr("href");
                var detailBody = await handleRequestByPromise({ url: link }); //进入详情页面爬电话
                var $$ = cheerio.load(detailBody);
                var phone = $$(".container .ctitle:contains('联系方式')").next().text();
                info.phone = phone;
                var name = $(dom).find('strong').text();
                info.link = link;
                info.name = name;
                var detailDom = $(dom).find("div");
                detailDom.map((subIndex, subDom) => {
                    var key = mapInfo($(subDom).find(".ctitle").text().replace(/\s/g,"")); //获取信息的label
                    if(key) {
                        var content = $(subDom).find(".ctxt").text().replace(/\s/g, "");
                        info[key] = content;
                    }
                })
                schoolInfo.push(info);
            }
        } else { break; }
    }
    return schoolInfo;
}

module.exports = getSchoolInfo;

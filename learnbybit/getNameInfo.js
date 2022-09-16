const cheerio = require('cheerio');

const handleRequestByPromise = require("../common").handleRequestByPromise;
const readFileSync = require("../common").readFileSync;
const config = require("./config");
const { domain, webPage } = config;
const wholeWebPath = `${domain}${webPage}`


//判断当前页码是否存在
judgePageExist = $ => {
    return !!$(".main-list");
}

mapInfo = text => {
    if (text.match(/学段/)) {
        return 'type';
    } else if (text.match(/地址/)) {
        return 'address';
    } else if (text.match(/电话/)) {
        if (text.match(/-/)) {
            return 'phone';
        } else { return 'mobile' }
    } else { return null; }
}

async function getNameInfo() {
    var nameInfo = {};
    var judgeSign = false;
    var body = readFileSync(__dirname + "/content.html");
    var $ = cheerio.load(body);
    var judgeSign = judgePageExist($);
    if (judgeSign) {
        var alphabetList = $(".main-list").children("li");
        alphabetList.map((i ,dom) => {
            var obj = {}
            var key = $(dom).children("span").eq(0).attr("id");
            nameInfo[key] = {};
            var eachAlpList = $(dom).find(".post-list>li")
            eachAlpList.map((i, eachWord) => {
                var word = $(eachWord).find("h3").text();
                var desc = $(eachWord).find("p").text();
                nameInfo[key][word] = desc.replace(/\n/g, "");
            });
        });
        console.log("nameInfo", nameInfo);
        return nameInfo;
    }
    // for (var i = 0; i < defaultTotalPages; i++) {
    //     if (!judgeSign) { break; }
    //     var curPage = i + 1; //当前页码
    //     var curUrl = `${wholeWebPath}&pages=${curPage}`;
    //     //获取当页的html内容
    //     var body = await handleRequestByPromise({ url: curUrl });
    //     var $ = cheerio.load(body);
    //     var judgeSign = judgePageExist($);
    //     if (judgeSign) {
    //         var schoolList = $(".index1").eq(1).find("li"); // 当页所有学校
    //         schoolList.map((index, dom) => {
    //             var info = {
    //                 link: "",
    //                 name: "",
    //                 type: "",
    //                 address: "",
    //                 phone: "",
    //                 mobile: "",
    //                 postalCode: "",
    //                 principal: "",
    //                 creater: "",
    //                 artificialPerson: "",
    //                 email: "",
    //             }
    //             var link = `${domain}${$(dom).find("a").attr("href")}`;
    //             var name = $(dom).find("a h1").text();
    //             info.link = link;
    //             info.name = name;
    //             var detailDom = $(dom).find(".text_div");
    //             detailDom.find("p").map((subIndex, subDom) => {
    //                 var key = mapInfo($(subDom).text());
    //                 if (key) {
    //                     var content = $(subDom).text().split("】")[1].replace(/\s/g, "");
    //                     info[key] = content;
    //                 }
    //             })
    //             nameInfo.push(info);
    //         })
    //     }
    // }
    return nameInfo;
}

module.exports = getNameInfo;

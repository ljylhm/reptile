var cheerio = require('cheerio');
var httpNet = require("../write");
const path = require("path");
const fs = require("fs");
//  
var url = path.resolve(__dirname, "../text/逐梦演艺圈.txt")
// httpNet.httpGet("https://movie.douban.com/j/search_subjects", {

//     type: "movie",
//     tag: "豆瓣高分",
//     sort: "rank",
//     page_limit: 20,
//     page_start: 20
// }, function (isOk, data) {
//     var res = data.subjects;
//     for (let i of res) {
//         httpNet.saveImg(i.cover, path.resolve(__dirname, "../img/" + i.title + ".jpg"), i.title + "上传完成")
//     }
// })

var unit = {
    getDataType: function (obj) {
        var _type = "",
            _type_str = "";

        _type = Object.prototype.toString.call(obj);
        _type_str = _type.substring(8, _type.length - 1);

        return _type_str;
    },
    writeTxt: function (address, data, text) {
        fs.appendFile(address, data, function (err) {
            if (err) {
                console.log("出错了~~~");
                throw err;
            } else {
                console.log(text);
            }
        })
    }
}
// https://movie.douban.com/subject/26588314/comments?start=20&limit=20&sort=new_score&status=P
var getComments = function (start, limit, num) {
    var base = start || 0,
        more = limit || 20,
        num = num || 20,
        str = "";
    httpNet.httpGet("https://movie.douban.com/subject/26322774/comments", {
        start: base,
        limit: more,
        sort: "new_score",
        status: "P"
    }, function (isOk, data) {
        if (!isOk) console.error("接口出错了~~");
        var res = data;
        var $ = cheerio.load(res);
        let getData = $(".comment-item .comment p");
        if (getData.length <= 0) return;
        for (let i in getData) {
            if (parseInt(i) == i) {
                if (base + parseInt(i) >= num) {
                    unit.writeTxt(url, str, "写入完成，共计写入" + num + "条");
                    return;
                }
                str = str + (base + parseInt(i) + "  " + getData[i].children[0].data + "\r\n")
                console.log(base + parseInt(i) + "  " + getData[i].children[0].data);
            }
        }
        unit.writeTxt(url, str, "写入评论" + base + " 到 " + (base + more) + "成功");
        getComments(base + 20, 20, num);
    }, {
            headers: {
                Cookie: 'll="118163"; bid=wYX7PV2Hmgg; __utmc=30149280; __utmz=30149280.1529472006.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmc=223695111; __utmz=223695111.1529472006.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __yadk_uid=4Qpa8m3M5bpgxAExyTT5RMmVStRcpK3K; _vwo_uuid_v2=D9A933CF9C2CFFBFE00330A1120B1342A|bf6659a3b85691b2a1d72d45a1abc60b; ct=y; ap=1; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1529481063%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=30149280.1413834343.1529472006.1529477484.1529481064.4; __utma=223695111.1294947886.1529472006.1529477484.1529481064.4; __utmb=223695111.0.10.1529481064; __utmt=1; __utmb=30149280.1.10.1529481064; ps=y; ue="948021695@qq.com"; dbcl2="136835318:wZB8QXYLSME"; ck=uiXw; push_noty_num=0; push_doumail_num=0; _pk_id.100001.4cf6=9d85c97c0431fb6d.1529472009.4.1529481223.1529477484.'
            }
        })
}

getComments(0, 20, 500);


// 26588314

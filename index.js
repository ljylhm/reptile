var httpNet = require("./write");
var commonUrl = "http://192.168.1.115:3000/";
var cheerio = require('cheerio');
var addArticle = "article/addArticle"
var para = {
    search: "",
    status: 1,
    orderby: "time",
    page: 1,
    size: 20
}
var para1 = {
    category_id: "",
    page: 5,
    size: 12,
    path: 'http://www.topys.cn',
}
// 爬取html
let getHtml = async (id) => {
    return new Promise((resolve, reject) => {
        httpNet.httpGet("http://www.topys.cn/article/detail/id/" + id, {}, function (isOk, data) {
            var $ = cheerio.load(data);
            var content = $("#new-detail").html();
            //console.log("content",content);
            resolve(content);
        })
    })
};
var upArticle = (obj) => {
    httpNet.httpPost(commonUrl + addArticle, obj, (isOk, data) => {
        if (!isOk) console.error(new Date().toString() + "上传发生错误");
        else {
            if (!data) console.error(new Date().toString() + " 服务器错误 ");
            if (data.code != 2000) console.error(data.message);
            else {
                console.log(new Date().toString() + "上传成功");
            }
        }
    }, {
            port: 3000
        })
};
var singleAction = async (list) => {
    let obj = {
        title: list.title,
        subtitle: list.description,
        titleimg: list.thumb,
        userid: 1,
        content: ""
    }
    let content = await getHtml(list.id);

    obj["content"] = content;
    return obj;
};

httpNet.httpPost("http://www.topys.cn/article/indexBjjx", para1, async (isOk, data) => {
    if (!isOk) return;
    var list = data.data.list;
    console.log(list);
    // for(let i of list){
    //     let getPara = await singleAction(i);
    //     upArticle(getPara)
    // }
})


// httpNet.httpGet("http://www.topys.cn/topic/towntalkList", para, function (isOk, data) {
//     if(!isOk) return;
//     let getData = data.data.list[0];
//     var para = {
//         title: getData.title,

//     }
//     httpNet.httpPost(commonUrl+addArticle,)

//     //httpNet.saveImg(data.data.list[0].thumb, "./img/1.jpg");
// })
// httpNet.httpGet("http://192.168.1.115:3000/article/queryArticle",{
//     page: 1,
//     limit: 10
// },function(err,resonse,data){
//    console.log(data);
// })

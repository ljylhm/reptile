const fs = require("fs");
const request = require("request");
//var httpNet = require("./http");

var httpNet = {
    http: function (method, url, data, cb, opt) {
        var defaultOpt = {
            url: url || "",
            method: method || "get",
            headers: {},
            json: true
        };
        var para = Object.assign(defaultOpt, opt);

        if (para.method == "get") para.qs = data;
        else para.body = data;

        request(para, cb)
    },
    httpGet: function (url, data, cb, opt) {
        this.http("get", url, data, cb, opt)
    },
    httpPost: function (url, data, cb, opt) {
        this.http("post", url, data, cb, opt)
    },
    saveImg: function (from, to) {
        request(from).pipe(fs.createWriteStream(to))
    }
}

var para = {
    search: "",
    status: 1,
    orderby: "time",
    page: 1,
    size: 20
}
httpNet.httpGet("http://www.topys.cn/topic/towntalkList", para, function (err, httpResponse, data) {
    console.log(data.data.list[0]);
    httpNet.saveImg(data.data.list[0].thumb, "./img/1.jpg");
})


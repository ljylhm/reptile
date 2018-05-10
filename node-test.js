var https = require("https");
var connect = require("http");
var cheerio = require('cheerio');
var request = require('request-promise');
var req = require('sync-request');
var fs = require('fs');
const { URL } = require('url');
const querystring = require('querystring');

var url = "http://www.topys.cn/topic/towntalkList";
//var url = "http://www.google.com/upload";
//var url = "https://movie.douban.com/review/best/";
var httpNet = {
    praseUrl: function (url) {
        var arr = url.split("/"),
            host = arr.splice(0, 3).join("/"),
            path = "/" + arr.splice(0, arr.length).join("/");
        var obj = {
            host: host,
            path: path
        }
        return obj;
    },
    parseData: function (data) {
        return querystring.stringify(data);
    },
    http: function (method, url, data, opt, cb) {
        var defaultOpt = {
            method: method || "get",
            headers: {}
        }
        var para = Object.assign(defaultOpt, this.praseUrl(url), opt);
        console.log(para);
        var req = connect.request(para, (res) => {
            var _data = "";
            res.on("data", (chunk) => {
                _data = _data + chunk;
            })
            res.on("end", () => {
                cb(_data);
            })
        })
        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });

        req.write(this.parseData(data));
        req.end();
    },
    httpGet: function (url, data, opt, cb) {
        this.http("get", url, data, opt, cb);
    },
    httpPost: function (url, data, opt, cb) {
        this.http("post", url, data, opt, cb);
    },
}

function main() {
    var data = {
        search: "",
        status: 1,
        orderby: "time",
        page: 1,
        size: 20
    }
    httpNet.httpPost(url, data, {}, (data) => {
        console.log(data);
    });
    // httpNet.httpGet(url, (html) => {
    //     var $ = cheerio.load(html);
    //     var list = $(".item");
    //     console.log(html.indexOf("种地"));
    // })
}

//console.log(connect["get"]);
main();





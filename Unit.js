var https = require("https");
const cheerio = require("cheerio");
const request = require("request");
const chalk = require("chalk");
var fs = require("fs");
var URL = require("url");
const querystring = require("querystring");

var http = {

    /**
     * @description 请求的通用方法
     * @param {String} method
     * @param {String} url
     * @param {JSON[Object]} data
     * @param {Function} cb
     * @param {JSON[Object]} opt
     */

    http: function (method, url, data, cb, opt) {
        var defaultOpt = {
            url: url || "",
            method: method || "get",
            headers: {},
            json: true
        };
        var para = Object.assign(defaultOpt, opt);
        var fn = function (err, data, response) {
            var isOk = true;
            if (err) {
                isOk = false;
                console.log(`发生了${err.message}`)
            }
            cb(isOk, response);
        };

        if (para.method == "get") para.qs = data;
        else para.body = data;

        request(para, fn);

    },

    /**
     * @description Get的请求方式
     * @param {String} url
     * @param {JSON[Object]} data
     * @param {Function} cb
     * @param {JSON[Object]} opt
     */

    httpGet: function (url, data, cb, opt) {
        this.http("get", url, data, cb, opt);
    },

    /**
     * @description Post的请求方式
     * @param {*} url
     * @param {*} String
     * @param {JSON[Object]} data
     * @param {Function} cb
     * @param {JSON[Object]} opt
     */

    httpPost: function (url, data, cb, opt) {
        this.http("post", url, data, cb, opt);
    },
}


var save = {
    saveImg: function (from, to, cb) { // 保存图片
        request(from).pipe(fs.createWriteStream(to));
        request(from).on("end", cb)
    },
    writeTxt: function (address, data, cb) { // 保存文本文件
        fs.appendFile(address, data, function (err) {
            if (err) {
                console.log(chalk.red("出错了~~~"));
                throw err;
            } else {
                cb && cb();
            }
        })
    }
}

module.exports = {
    http: http,
    save: save
}

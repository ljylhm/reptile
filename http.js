var https = require("https");
var connect = require("http");
var cheerio = require("cheerio");
var fs = require("fs");
const URL = require("url");
const querystring = require("querystring");

var url = "http://www.topys.cn/topic/towntalkList";
//var url = "https://movie.douban.com/review/best/";
var httpNet = {
  praseUrl: function (urlNet) {
    var arr = URL.parse(urlNet);
    var obj = {
      get: {
        host: arr.host,
        path: arr.path,
      },
      protocol: arr.protocol.indexOf("https") ? "https" : "http"
    };
    return obj;
  },
  parseData: function (data) {
    return querystring.stringify(data);
  },
  http: function (method, url, data, opt, cb) {
    var defaultOpt = {
      method: method || "get",
      headers: {}
    };
    var para = Object.assign(defaultOpt, this.praseUrl(url).get, opt);
    var httpType = this.praseUrl(url).protocol == "https" ? https : connect;
    var req = httpType.request(para, res => {
      var _data = "";
      res.on("data", chunk => {
        _data = _data + chunk;
      });
      res.on("end", () => {
        cb(_data);
      });
    });
    req.on("error", e => {
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
  }
};

function main() {
  var data = {
    search: "",
    status: 1,
    orderby: "time",
    page: 1,
    size: 20
  };
  httpNet.httpPost(url, data, {}, (data) => {
    var data = JSON.parse(data);
    console.log(data);
    var res = data.data.list;
  });
}

module.exports = httpNet



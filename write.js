const fs = require("fs");
const request = require("request");

var httpNet = {
  http: function(method, url, data, cb, opt) {
    var defaultOpt = {
      url: url || "",
      method: method || "get",
      headers: {},
      json: true
    };
    var para = Object.assign(defaultOpt, opt);
    var fn = function(err, data, response) {
      var isOk = true;
      if (err) {
        isOk = false;
        console.log(`发生了${err.message}`)
      }
      cb(isOk,response);
    };

    if (para.method == "get") para.qs = data;
    else para.body = data;

    request(para, fn);
  },
  httpGet: function(url, data, cb, opt) {
    this.http("get", url, data, cb, opt);
  },
  httpPost: function(url, data, cb, opt) {
    this.http("post", url, data, cb, opt);
  },
  saveImg: function(from, to) {
    request(from).pipe(fs.createWriteStream(to));
  }
};

module.exports = httpNet;

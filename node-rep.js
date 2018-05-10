/**
 * Created by ljy48594 on 2017/9/26.
 */
// var request = require('request');
var https = require("https");
var cheerio = require('cheerio');
var request = require('request-promise');
var req = require('sync-request');
var fs = require('fs');

var url = "   ";
var com_item_arr = [];

// 爬取主要影评的方法
function getMainCon(url, callback) {
    https.get(url, function (res) {
        var html = ''
        res.on('data', function (data) {
            html = html + data;
        })
        res.on('end', function () {

            var $ = cheerio.load(html);
            // 获取每条评论内容
            var review_item = $('.review-item');
            review_item.each(function (index, item) {
                var com_item = {
                    title: '',
                    author: '',
                    img: '',
                    content: '',
                }
                // 爬取标题和文章的内容网址
                var title = $(this).find('.title .title-link').text();
                var con_href = $(this).find('.title .title-link').attr('href');
                com_item.title = title;
                // 爬取图片
                var img = $(this).children('.subject-img').children('img').attr('src');
                com_item.img = img;
                // 爬取作者
                var author = $(this).find('.author span').text();
                com_item.author = author;
                // 获取下一页的url
                // var nextPage = 'https://movie.douban.com/review/best?start='
                // 爬取内容
                var del_content = '';

                getDetCon(con_href, function ($) {
                    $('.review-content').children('p').each(function (index, item) {
                        del_content = del_content + $(this).text() + '\n'
                    })
                    com_item.content = del_content;
                    com_item_arr.push(com_item);
                    saveImg(com_item.img, com_item.title);
                    saveTxt(com_item.title, com_item.content);
                    // 这里做一个判断，如果 index = length - 1，说明此循环已结束
                    if (index >= review_item.length - 1) {

                    }
                });
            })
        })
    })
}
// 爬取详细内容的方法
function getDetCon(url, callback) {
    request.get(url).then(function (data) {
        var $ = cheerio.load(data);
        callback($)
    })
}

// 将图片和信息保存进入文件夹中
function saveImg(url, title) {
    request(url).pipe(fs.createWriteStream('./img/' + title + '.jpg'))
}

// 将评论内容写入txt
function saveTxt(title, content) {
    fs.writeFile('./content/' + title + '.txt', content, 'utf-8', function (err) {
        if (err) {
            console.log('写入文件出错~~~~~');
        }
    })
}


// 执行区域
getMainCon(url);


const express = require('express')
const app = express()
const superagent = require('superagent')
const cheerio = require('cheerio')
const Nightmare = require('nightmare')// 自动化测试包，处理动态页面
const nightmare = Nightmare({show:true})// show:true  显示内置模拟浏览器


let tenderList = []

nightmare
.goto('https://box.jimu.com/Venus/List')
.evaluate(()=>document.querySelector('div.project-list').innerHTML)
.then(htmlStr=>{
	tenderList = gotTenderList(htmlStr)
})
.catch(error=>{
	console.log(`抓取数据失败-${error}`)
})


let gotTenderList = (htmlStr) => {
  let tenderList = [];
  let $ = cheerio.load(htmlStr)
  $('.project').each((idx, ele) => {
    let tenderObj = {
      name: $(ele).find('.title').text(),
      rate:  $(ele).find('.invest-item-profit').text(),
      month:$(ele).find('.time-limit').text(),
      status:$(ele).find('.status .num').text()
    };
    tenderList.push(tenderObj)
  });

  return tenderList
};

let server = app.listen(3000,function(){
	let host = server.address().address
	let port = server.address().port
	console.log('Your App is running at http://localhost:',port)
})
app.get('/',async(req,res,next)=>{
	res.send({
    tenderList: tenderList
	})
})

const express = require('express')
const app = express()
const superagent = require('superagent')
const cheerio = require('cheerio')
const Nightmare = require('nightmare')// 自动化测试包，处理动态页面
const nightmare = Nightmare({show:true})// show:true  显示内置模拟浏览器


let hotNews = []
let localNews = []

nightmare
.goto('http://news.baidu.com/')
.wait('div#local_news')
.evaluate(()=>document.querySelector('div#local_news').innerHTML)
.then(htmlStr=>{
	localNews = gotLocalNews(htmlStr)
})
.catch(error=>{
	console.log(`本地新闻抓取失败-${error}`)
})

superagent.get('http://news.baidu.com/').end((err,res)=>{
	if(err){
		console.log(`热点新闻抓取失败-${err}`)
	}else{
		pageRes = res
		hotNews = gotHotNews(res)
	}
})

let gotHotNews = (res)=>{
	let hotNews = []
	let $ = cheerio.load(res.text)
	$('#pane-news ul li a').each((idx,ele)=>{
		let news = {
			title:$(ele).text(),
			href:$(ele).attr('href')
		}
		hotNews.push(news)
	})
	return hotNews
}

let gotLocalNews = (htmlStr) => {
  let localNews = [];
  let $ = cheerio.load(htmlStr)
  $('#localnews-focus li a').each((idx, ele) => {
    let news = {
      title: $(ele).text(),
      href: $(ele).attr('href'),
    };
    localNews.push(news)
  });

  // 本地资讯
  $('#localnews-zixun ul li a').each((index, item) => {
    let news = {
      title: $(item).text(),
      href: $(item).attr('href')
    };
    localNews.push(news);
  });

  return localNews
};

let server = app.listen(3000,function(){
	let host = server.address().address
	let port = server.address().port
	console.log('Your App is running at http://localhost:',port)
})
app.get('/',async(req,res,next)=>{
	res.send({
		hotNews: hotNews,
    localNews: localNews
	})
})

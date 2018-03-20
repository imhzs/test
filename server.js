let fs = require('fs');
let express = require('express');
// let qs = require('querystring');
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let sleep = require('system-sleep');

let app = express();
let server = require('http').Server(app);
let perPage = 9;
let curPage = 1;
let totalPage = 1;
let headers = {};

app.use(bodyParser.json());
app.use(express.static(__dirname));

// 接收前端请求
app.post('/getData', function(req, resp) {
	let data = JSON.stringify({status: 200, message: 'success'});
	headers = req.headers;
	requestStart(req.body);
	resp.send(data);
});

server.listen('3008', function() {
	console.log('The server is running at *:3000');
});

// 请求入口
function requestStart(params)
{
	let startDate = params.start_date;
	let endDate = params.end_date;

	if (curPage > 1) {
		curPage = totalPage = 1;
		sleepSeconds().then((seconds) => {
			console.log(`Sleep end: ${seconds}`);
			params.start_date = startDate;
			params.end_date = endDate;
			console.log(params);
			requestData(params);
		}).catch((msec) => {
			console.log(msec);
		});
	} else {
		console.log('首次请求');
		requestOne(params).then((body) => {
			console.log(body);
			sleepSeconds().then((seconds) => {
				console.log(`Sleep end: ${seconds}`);
				params.start_date = startDate;
				params.end_date = endDate;
				console.log(params);
				requestData(params);
			}).catch((msec) => {
				console.log(msec);
			});
		}).catch(error => {
			console.log(error);
		});
	}
}

// 第一次请求
function requestOne(params)
{
	let date = new Date();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	day = (day < 10) ? '0' + day : day;
	month = (month < 10) ? '0' + month : month;
	let today = date.getFullYear() + '-' + month + '-' + day;

	params.status = 1;
	params.page = 1;
	params.start_date = today;
	params.end_date = today;

	return sendPost(params);
}

// 循环请求
function requestData(params)
{
	if (curPage > totalPage) {
		return;
	}

	console.log(`Current Page: ${curPage}`);
	params.status = '';
	params.page = curPage;
	curPage++;

	sendPost(params).then((body) => {
		console.log(body);
		writeToFile(body);
		totalPage = Math.ceil(body.totalNum / perPage);
		sleepSeconds().then((seconds) => {
			console.log(`Re-request when sleep: ${seconds} seconds.`);
			requestData(params);
		}).catch((msec) => {
			console.log(`sleeping: ${msec}`);
		});
	}).catch((error) => {
		console.log(error);
	});
}

// 发送请求
function sendPost(params) {
	let contents = {
		name: '',
		phone_num: '',
		status: params.status,
		start_time: params.start_date,
		end_time: params.end_date,
		page: params.page
	};
	
	console.log(params);

	let options = {
		// url: 'http://agent.tjstar.net/admin/merchat/list',
		url: 'http://agent.hzspro.com/phone/sendcode',
		method: 'POST',
		gzip: true,
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'zh-CN,zh;q=0.9',
			'Content-Length': contents.length,
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Connection': 'keep-alive',
			'Cookie': 'lang=zh-cn; PHPSESSID=' + params.login_cookie + ';' + 'XSRF-TOKEN=eyJpdiI6IjFnendoNjJ1TVlvam5zY3M5ak55RXc9PSIsInZhbHVlIjoiWjZpSW11MUs0T2NLNkJaQTlXVHVxRFN2Ryt4R3lYK0hcLzVZUFlRc1dpM3kzb1dNVk45OUVaeU9MVHdCVm5vUGNTMWw0Zk5YbXVSdUdkcmtGUk5cL1dadz09IiwibWFjIjoiNjhiYWZhY2MyMDgxNzZhMWQzY2EzNjhmYzYzOTA2NGM5OGZmNDY5N2I4OGQzOTJiMjcxM2JlMTc3M2UzMjI3OSJ9; laravel_session=eyJpdiI6IldmcFwvdFgwTlh3YVJFcW1CV1NJemtnPT0iLCJ2YWx1ZSI6IkRaWnd5S0NFUlVTK04rU1FyT0trZmlBTWl4bE53VWJwQU04cHlFVTF0Y29oNzF2UjdDemZnWEU4UUcxbGtyQmhwdWgyNGFPcnpPREdFemRMRVJ5UXFnPT0iLCJtYWMiOiI1YmExYjk1NTY4MmI1ZGIyOGQ3ZWYyOGNmNGEwMzgzNjgzMTA2MjI2ZmVhODljOTgzMzEzMDIzMzM1ZGE3ZDFiIn0%3D',
			'host': 'agent.hzspro.com',
			'Origin': 'http://agent.hzspro.com',
			'Referer': 'http://agent.hzspro.com/phone/sendcode',
			'X-Forwarded-For': '111.155.116.238',
			'Client-Ip': '111.155.116.238',
			// 'host': 'agent.tjstar.net',
			// 'Origin': 'http://agent.tjstar.net',
			// 'Referer': 'http://agent.tjstar.net/admin/merchat/list',
			'User-Agent': headers['user-agent'],
			'X-Requested-With': 'XMLHttpRequest'
		},
		form: contents
	};

	return new Promise((resolve, reject) => {
		request(options, function(error, response, body) {
			if (error) {
				reject(error);
			} else {
				resolve(JSON.parse(body));
			}
		});
	});
}

// 休眠时间
function sleepSeconds()
{
	let seconds = getRandom(3, 10);
	let msec = seconds * 1000;

	console.log(`Start sleep: ${msec} seconds.`);
	sleep(msec);
	return new Promise((resolve, reject) => {
		resolve(seconds);
		reject(seconds);
	});
}

// 获取置顶范围的随机数
function getRandom(start, end) {
	var length = end - start;
	var num = parseInt(Math.random() * (length) + start);
	return num;
}

// 写入文件
function writeToFile(content) {
	let date = new Date();
	let basePath = path.resolve(__dirname, './storage');
	if (!fs.existsSync(basePath)) {
		fs.mkdirSync(basePath);
	}
	let filename = basePath + '\\' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '.txt';

	fs.writeFile(filename, JSON.stringify(content) + '\r\n\r\n\r\n', { 'flag': 'a' }, function(err) {
		if (err) {
			console.log(err);
		}
	});
}

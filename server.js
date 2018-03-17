let fs = require('fs');
let express = require('express');
let qs = require('querystring');
let bodyParser = require('body-parser');
let path = require('path');
// let request = require('request');
// let zlib = require('zlib');

let app = express();
let server = require('http').Server(app);

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/getData', function(request, response) {
	console.log(request.body);
	let data = JSON.stringify({status: 200, message: 'success'});
	console.log(request.headers);
	sendPost(request.body, request.headers);
	response.send(data);
});

server.listen('3000', function() {
	console.log("The server is running at *:3000");
});

function sendPost(params, headers) {
	// let contents = {
	//     name: '',
	//     phone_num: '',
	//     status: '',
	//     start_time: params.start_date,
	//     end_time: params.end_date,
	//     page: '1',
	//     telephone: '13692155075'
	// };
	 
	// let options = {
	//     // host: 'agent.tjstar.net',
	//     // path: '/admin/merchat/list',
	//     url: 'http://agent.hzspro.com/phone/sendcode',
	//     method: 'POST',
	//     headers:{
	//     	'Accept': 'application/json, text/javascript, */*; q=0.01',
	//     	'Accept-Encoding': 'gzip, deflate',
	//     	'Accept-Language': 'zh-CN,zh;q=0.9',
	//     	'Content-Length': contents.length,
	//     	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	//     	'Cookie': 'lang=zh-cn; PHPSESSID=' + params.login_cookie + ';' + 'XSRF-TOKEN=eyJpdiI6IjFnendoNjJ1TVlvam5zY3M5ak55RXc9PSIsInZhbHVlIjoiWjZpSW11MUs0T2NLNkJaQTlXVHVxRFN2Ryt4R3lYK0hcLzVZUFlRc1dpM3kzb1dNVk45OUVaeU9MVHdCVm5vUGNTMWw0Zk5YbXVSdUdkcmtGUk5cL1dadz09IiwibWFjIjoiNjhiYWZhY2MyMDgxNzZhMWQzY2EzNjhmYzYzOTA2NGM5OGZmNDY5N2I4OGQzOTJiMjcxM2JlMTc3M2UzMjI3OSJ9; laravel_session=eyJpdiI6IldmcFwvdFgwTlh3YVJFcW1CV1NJemtnPT0iLCJ2YWx1ZSI6IkRaWnd5S0NFUlVTK04rU1FyT0trZmlBTWl4bE53VWJwQU04cHlFVTF0Y29oNzF2UjdDemZnWEU4UUcxbGtyQmhwdWgyNGFPcnpPREdFemRMRVJ5UXFnPT0iLCJtYWMiOiI1YmExYjk1NTY4MmI1ZGIyOGQ3ZWYyOGNmNGEwMzgzNjgzMTA2MjI2ZmVhODljOTgzMzEzMDIzMzM1ZGE3ZDFiIn0%3D',
	//     	'host': 'agent.hzspro.com',
	//     	'Origin': 'http://agent.hzspro.com',
	//     	'Referer': 'http://agent.hzspro.com/phone/sendcode',
	//     	// 'host': 'agent.tjstar.net',
	//     	// 'Origin': 'http://agent.tjstar.net',
	//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
	//         'X-Requested-With': 'XMLHttpRequest',
	//     },
	//     form: contents
	// }

	// request(options, function(error, response, body) {
	// 	console.log(response);
	// 	console.log((body));
	// }).pipe();


	let http = require('http');

	let contents = {
	    name: '',
	    phone_num: '',
	    status: '',
	    start_time: params.start_date,
	    end_time: params.end_date,
	    page: '1',
	    telephone: '13692155075'
	};

	let postOpts = {
			host: 'agent.hzspro.com',
			path: '/phone/sendcode',
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'zh-CN,zh;q=0.9',
				'Content-Length': contents.toString().length,
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Cookie': 'lang=zh-cn; PHPSESSID=' + params.login_cookie + ';' + 'XSRF-TOKEN=eyJpdiI6IkNsRm9seFplYkdPdXc1QmlnUmxDcXc9PSIsInZhbHVlIjoiRmFFQWtUSTRqaStoQUFrdDhGY2pMWjgrZDlWUnFzT0xkaHN3RFNJWkZCN1ZtUlNRRjJRb25jbTVBZmljUkllNzB2UnNpdXF0bVZnNjZZTVEwK2FwK2c9PSIsIm1hYyI6ImY4MzczZDQ3NDFmYTRkZTkyMjhmZGUxZTlmYWU3MDY2MmFjZjY2Yzc1NGQ1ZDcwNDIzY2I1NGI2NzFkNmU4NTMifQ%3D%3D',
				'host': 'agent.hzspro.com',
				'Origin': 'http://agent.hzspro.com',
				'Referer': 'http://agent.hzspro.com/phone/sendcode',
				// 'host': 'agent.tjstar.net',
				// 'Origin': 'http://agent.tjstar.net',
				'User-Agent': headers['user-agent'],
				'X-Requested-With': 'XMLHttpRequest'
			}
	  	};

	  	let request = http.request(postOpts, function(response) {
  			let result = [];
			let length = 0;
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				result.push(chunk);
				length += Buffer.byteLength(chunk);
				console.log(chunk);
			});

			response.on('end', (data) => {
				if (data) {
					result.push(chunk);
					length += Buffer.byteLength(chunk);
				}
				console.log(result);
				// console.log(Buffer.concat(result, length));
			});
	  	});

  	request.on('error', function(e) {
		console.log('错误：' + e.message);
	});

	request.write(qs.stringify(contents));
	request.end();
}

function writeToFile(content) {
	let date = new Date();
	let filename = path.resolve(__dirname, './storage') + '\\' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '.txt';
	console.log(filename);
	fs.writeFile(filename, content + '\r\n\r\n\r\n', { 'flag': 'a' }, function(err) {
    	if (err) {
        	console.log(err);
    	}
	});
}

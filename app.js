const http = require('http');
const conf = require('./config/defaultConfig.js');
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

// const server = http.createServer((req,res) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-Type', 'text/plain');
// 	res.end('Hello Http!')
// });

// const server = http.createServer((req,res) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-Type', 'text/html');
// 	res.write('<html>');
// 	res.write('<body>');
// 	res.write('Hello World!');
// 	res.write('</body>');
// 	res.end('</html>');
// });

const server = http.createServer((req,res) => {
	const filePath = path.join(conf.root, req.url);
	fs.stat(filePath, (err, stats) => {
		if(err){
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/plain');
			res.end(`${filePath} is not a directory or file`);
			return;
		}
		if(stats.isFile()){ // 是否是文件
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			fs.createReadStream(filePath).pipe(res);   // 推荐
			// fs.readFile(filePath, (err, data) => {
			// 	res.end(data)
			// });
		} else if(stats.isDirectory()){
			fs.readdir(filePath, (err, files) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/plain');
				res.end(files.join(','))
			});
		}
	});
	// res.statusCode = 200;
	// res.setHeader('Content-Type', 'text/plain');
	// res.write(req.url + '\n')
	// res.end(filePath);
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;
	console.log(`Server started at ${chalk.green(addr)}`);
});
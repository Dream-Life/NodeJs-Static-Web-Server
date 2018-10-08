const http = require('http');
const conf = require('./config/defaultConfig.js');
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const openurl = require('./helper/openurl.js')
const route = require('./helper/route.js')
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


class Server {
    constructor(config) {
        this.conf = Object.assign({}, conf, config)
    }

    start() {
        const server = http.createServer((req, res) => {
            // console.log(req);	
            const filePath = path.join(this.conf.root, req.url);

            //  回调优化
            route(req, res, filePath, this.conf)
                //  回调优化


            //  回调未优化
            /*
            fs.stat(filePath, (err, stats) => {
                // error
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
                } else if(stats.isDirectory()){ // 是否是目录
                    fs.readdir(filePath, (err, files) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(files.join(','))
                    });
                }
            });
            */
            //  回调未优化


            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/plain');
            // res.write(req.url + '\n')
            // res.end(filePath);
        });

        server.listen(this.conf.port, this.conf.hostname, () => {
            // 回调函数callback()
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.log(`Server started at ${chalk.green(addr)}`);
            openurl(addr)
        });
    }
}

module.exports = Server
const fs = require('fs')
const promisify = require('util').promisify
const path = require('path')
const conf = require('../config/defaultConfig.js');
const Handlebars = require('handlebars')
const compress = require('./compress.js')
const mime = require('./mime.js')
const range = require('./range.js')

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

const tplPath = path.join(__dirname, '../template/dir.tpl')
    // 只会执行一次，之后会直接用缓存的数据，所以这里用同步获取
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())

module.exports = async function(req, res, filePath) {
    try {
        const stats = await stat(filePath)
        if (stats.isFile()) { // 是否是文件
            const contentType = mime(filePath)
            res.setHeader('Content-Type', contentType);

            // range 范围 (拿到文件的部分内容)
            // curl -r 0-10 -i [URL OR FILES]
            let rs;
            const { code, start, end } = range(stats.size, req, res)
            console.log(code);
            console.log(start + '-' + end);
            console.log(stats);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath)
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, { start, end })
            }
            // range 范围

            // 数据流Stream (推荐)
            // fs.createReadStream(filePath).pipe(res); 
            // 数据流Stream

            // 压缩 (推荐)
            // let rs = fs.createReadStream(filePath)
            if (filePath.match(conf.compress)) {
                rs = compress(rs, req, res)
            }
            rs.pipe(res)
                // 压缩

            // 不推荐
            // fs.readFile(filePath, (err, data) => {
            // 	res.end(data)
            // });
        } else if (stats.isDirectory()) { // 是否是目录
            const files = await readdir(filePath)
            res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Type', 'text/html');
            const data = {
                files,
                title: path.basename(filePath),
                dir: path.relative(conf.root, filePath)
            }
            console.log('filePath:' + filePath);
            console.log('relative:' + data.dir);
            // res.end(files.join(','))
            res.end(template(data))
        }
    } catch (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file`);
        return;
    }
}
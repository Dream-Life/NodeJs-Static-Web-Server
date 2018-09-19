const fs = require('fs')
const promisify = require('util').promisify

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports = async function (req, res, filePath) {
    try {
		const stats = await stat(filePath)
		if(stats.isFile()){ // 是否是文件
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			fs.createReadStream(filePath).pipe(res);   // 推荐
			// fs.readFile(filePath, (err, data) => {
			// 	res.end(data)
			// });
        } else if(stats.isDirectory()){ // 是否是目录
            const files = await readdir(filePath)
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			res.end(files.join(','))
			
		}
	} catch(err) {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory or file`);
		return;
	}
}
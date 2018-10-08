module.exports = {
    root: process.cwd(), // node 运行的路径（绝对路径）
    hostname: '127.0.0.1',
    port: 9527,
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 600, // 缓存支持使用的时间，单位：秒（s）
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
};
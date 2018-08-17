var express = require('express');
var path = require('path');
var session = require('express-session');
var router = require('./router');
var bodyParser = require('body-parser');

var app = express();
//path.join 是用来转义和拼接路径的，__dirname 是动态相对路径
// readFile里的路径是相对于控制台的路径 ，模块路径不受影响
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules')));

app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/')); // 默认就是 ./views 目录

//解析post路由
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'ming',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}));

app.use(router);

// 配置一个处理 404 的中间件
app.use(function (req, res) {
    res.render('404.html')
});

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
});

app.listen(5000, function () {
    console.log("listening 5000...")
});
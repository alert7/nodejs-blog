var express = require('express');
var User = require('./models/user');
var Topic = require('./models/topic');
var md5 = require('blueimp-md5');

var router = express.Router();

router.get('/', function (req, res) {
   /* res.render('index.html', {
        user: req.session.user,
        topic: topic
    });*/
    Topic.find(function (err, topic) {
        if (err) {
            return res.status(500).send("server is err");
        }
        res.render('index.html', {
            user: req.session.user,
            topic: topic
        })
    })
});
//渲染登录界面
router.get('/login', function (req, res) {
    res.render('login.html')
});
//处理登录请求
router.post('/login', function (req, res, next) {
    var body = req.body;
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    },function (err, user) {

        if (err) {
            return next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or password  error'
            })
        }
        //用户存在，登录成功
        req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
});

//渲染注册也页面
router.get('/register', function (req, res) {
    res.render('register.html')
});
//处理注册请求
router.post('/register', function (req, res, next) {
    var body = req.body;
    User.findOne({
        $or: [{
            email: body.email
        },{
            nickname: body.nickname
    }]
    },function (err, data) {
        if (err) {
            return next(err);
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            });
            return res.send('邮箱或者密码已存在，请重试')
        }
        body.password = md5(md5(body.password));
        new User(body).save(function (err, user) {
            if (err) {
                return next(err)
            }
            req.session.user = user;
            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
        })
    })
});

//退出
router.get('/logout', function (req, res) {
    // 清除登陆状态
    req.session.user = null;
    // 重定向到登录页
    res.redirect('/login')
});

//进入个人主页
router.get('/settings/profile', function (req, res) {
    res.render('settings/profile.html', {
        user: req.session.user
    })
});

//处理用户的信息
router.post('/settings/profile', function (req, res, next) {

/*    body.password = md5(md5(body.password));
    new User(body).save(function (err, user) {
        if (err) {
            return next(err)
        }
        req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })*/
    User.findOne({
        password: req.body.oldPassword
    }, function (err, data) {
       if (err) {
           return next(err)
       }
       if (data) {
           var id = req.body.id;
           console.log(id);
           User.findByIdAndUpdate(id, req.body.password, function (err, user) {
               if (err) {
                   return next(err)
               }
               req.session.user = user;
               res.redirect('/');
                res.status(200).json({
                    err_code: 0,
                    message: 'Ok'
                })
           })
       }
    });
});

//账户设置
router.get('/settings/admin', function (req, res) {
     res.render('settings/admin.html', {
         user: req.session.user
     })
});
//处理账户设置，更改密码
router.post('/settings/admin', function (req, res) {
    var id = req.body.id;
    var password = req.body.password;
    console.log(req.body.oldPassword);
    console.log(req.body.password);
    //这是req.body,此时的数据是从编辑框提交过去的
    User.findByIdAndUpdate(id, password, function (err, user) {
        if (err) {
            return next(err)
        }
        res.session.user = user;
        res.redirect('/settings/admin')
    })
});
//删除
router.post('/delete', function (req, res) {
    var id = req.body.id;
    console.log(id);
    User.findByIdAndRemove(id, function (err) {
        if (err) {
            return res.status(500).send('server error')
        }
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        });
        /*res.redirect('/')*/
    })
});

//发起
router.get('/topic/new', function (req, res) {
    res.render('topic/new.html')/*, {
        user: req.session.user
    });*/
  /*  User.find(function (err, user) {
        if (err) {
            return res.status(500).send("server is err");
        }
        res.render('index.html', {
            user: user
        })
    });*/
    /*Topic.find(function (err, topic) {
        if (err) {
            return res.status(500).send("server is err");
        }
        res.render('index.html', {
            topic: topic
        })
    })*/
});

//提交博客
router.post('/topic/new', function (req, res,next) {
    var body = req.body;
    new Topic(body).save(function (err, topic) {
        if (err) {
            return next(err)
        }
        req.session.topic = topic;
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
});

module.exports = router;

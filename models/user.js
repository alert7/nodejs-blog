var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser:true}, function(err){
    if(err){
        console.log('Connection Error:' + err)
    }else{
        console.log('Connection success!')}
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // 创建时间
    created_time: {
        type: Date,
        //Date.now()会即刻调用，Date.now会在实例的时候返回一个默认值
        default: Date.now
    },
    // 最近更新
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar:{
        type: String,
        default: '/public/img/avatar-default.png'
    },
    //个人简介
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [-1,0,1]
    },
    birthday: {
        type: Date
    },
    // 状态
    status: {
        type: Number,
        enum: [0,1,2],
        default: 0
    }
});

//User 会变成users
module.exports = mongoose.model('User', userSchema);

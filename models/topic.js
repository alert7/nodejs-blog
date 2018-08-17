var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser:true}, function(err){
    if(err){
        console.log('Connection Error:' + err)
    }else{
        console.log('Connection success!')}
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
    /*nickname: {
        type: String,
        default: require.body.nickname
    },*/
    //板块
    plate: {
        type: String,
        required: true
    },
    //标题
    head_name: {
        type: String,
        required: true
    },
    // 内容
    content: {
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

});


module.exports = mongoose.model('Topic', userSchema);
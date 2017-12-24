var userDao = require('./userDao');
var myUrl = require('./myUrl');
var data = require('./data');

var which;

function index(w) {
    which = w;
    userDao.getBeforeRemind(function (error, result) {
        result.forEach(function (t) {
            sendBeforeRemindToUser(t);
        })
    });
}

function sendBeforeRemindToUser(userMsg) {
    if(!userMsg['todaySchedule'])
    {
        return;
    }
    var openId = userMsg['openId'];
    var schedule = JSON.parse(userMsg['todaySchedule']);
    if(schedule[which]){
        var oneClass = schedule[which];
        var content = {
            'touser':openId,
            'template_id':data.templateId.beforeRemind
        };
        var url = {
            host:'api.weixin.qq.com',
            path:'/cgi-bin/message/template/send?access_token='
        };
        var dataContent = {};
        dataContent.courses = {
            value:oneClass.subject
        };
        dataContent.classroom = {
            value:oneClass.classroom
        };
        dataContent.time = {
            value:data.time[which-1]
        };
        content.data = dataContent;
        myUrl.sendTemplateMsg(url,content)
    }

}
exports.index = index;
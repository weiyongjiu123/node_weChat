var userDao = require('./userDao');
var data = require('./data');
var myUrl = require('./myUrl');
myUrl.init();       //先获取accessToken,避免登录等发提醒时抢着获取

function index() {
    userDao.getDayRemindSch(function (error, result) {
        result.forEach(function (t) {
            sendDayRemindToUser(t)
        })
    });
}
function sendDayRemindToUser(userMsg) {
    var openId = userMsg['openId'];
    if(!userMsg['todaySchedule'])
    {
        return;
    }
    var schedule = JSON.parse(userMsg['todaySchedule']);
    if(!schedule || !getJsonLen(schedule))
    {
        return;
    }
    var url = {
        host:'api.weixin.qq.com',
        path:'/cgi-bin/message/template/send?access_token='
    };
    var title = {
        'touser':openId,
        'template_id':data.templateId.dayRemindTitle
    };
    title.data = {
        count:{
            value:getJsonLen(schedule)
        }
    };
    myUrl.sendTemplateMsg(url,title,function () {
        var content = {
            'touser':openId,
            'template_id':data.templateId.dayRemindContent
        };
        var dataContent = {};
        for(var k in schedule){
            dataContent.courses = {
                value:schedule[k].subject
            };
            dataContent.time = {
                value:data.time[k-1]
            };
            dataContent.classroom = {
                value:schedule[k].classroom
            };
            content.data = dataContent;
            dataContent = {};
            url = {
                host:'api.weixin.qq.com',
                path:'/cgi-bin/message/template/send?access_token='
            };
            myUrl.sendTemplateMsg(url,content)
        }
    });
}
function getJsonLen(json) {
    var len = 0;
    for(var key in json)
    {
        len++;
    }
    return len;
}



// setTimeout(function () {
//     userDao.closeDb();
// },10000);

exports.index = index;
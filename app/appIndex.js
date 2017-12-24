var url = require('url');
var xml = require('./xml');
var tools = require('./tools');
var myUrl = require('./MyUrl');
var mysql = require('./mysql');
var db = mysql.getConn();
myUrl.init();   //服务器已开启就先获取 access_token
function doGet(require,response){
     var param = url.parse(require.url,true).query;
}
function doPost(require,response){

    require.on('data',function(data){
        // console.log(data.toString());
        var text = xml.getJsonByXml(data.toString());
        var params = {
            res:response,
            receive:text
        };
        if(!text.MsgType)
        {
            response.end("非法访问");
            return;
        }
        var type = text.MsgType.substring(0,1).toUpperCase()+text.MsgType.substring(1);
        var func = eval('reply'+type+'Msg');
        func(params,function (params) {
            xml.replyTextMsg(params);
        });
        // xml.replyTextMsg(json);
    });
}
// function replyTextMsg(params,callback) {
//     isGetSchedule(params,callback);
//     // params.content = '你发送的是：'+params.receive.MsgType+' 类型，内容是'+params.receive.Content;
//     // end(params,callback);
// }
function replyTextMsg(params,callback) {
    var text = params.receive.Content;
    var matchRes = text.match(/^s:(\d*)$/);
    if(matchRes)
    {
        db.query("select schedule from users where openId=? limit 0,1",[params.receive.FromUserName],function (error, res) {
           var schedule = JSON.parse(res[0].schedule);
            myUrl.sendSchedule(schedule[matchRes[1]],matchRes[1],params.receive.FromUserName);
        });
        params.content = null;
        end(params,callback);
        return;
    }
    var loginMatch = text.match(/^login:(\d{10})_([\S]*$)/);
    if(loginMatch)
    {
        var number = loginMatch[1];
        var password = loginMatch[2];
       db.query("select id from users where openId=? and login=1 limit 1",[params.receive.FromUserName],function (error, res) {
           if(res.length > 0)
           {
               params.content = '你已经登录了';
               end(params,callback);
           }else{
               var url = {
                   hostname: 'smallsi.com',
                   port: 9503,
                   path: '/?number='+number+'&password='+password+'&type=schedule',
                   method: 'GET'
               };
                myUrl.get(url,function (data) {
                    data = JSON.parse(data);
                    if(!data.error){
                        db.query("update users set schedule=?,login=1 where openId=?",[JSON.stringify(data.content),params.receive.FromUserName],function (error, res) {
                            if(res.affectedRows){
                                params.content = '登录成功';
                                end(params,callback);
                            }else{
                                params.content = '登录失败，请重试';
                                end(params,callback);
                            }
                        })
                    }else{
                        params.content = '登陆失败，请检查学号和密码是否正确';
                        end(params,callback);
                    }
                });

           }
       });
        return;
    }
    params.content = '你发送的是：'+params.receive.MsgType+'类型，内容是：'+text;
    end(params,callback);
}
function replyImageMsg(params,callback) {
    params.content = '你发送的是：'+params.receive.MsgType+' 类型，图片路径是'+
        params.receive.PicUrl+' 图片消息媒体id: '+params.receive.MediaId;
    end(params,callback);
}
function replyVoiceMsg(params,callback) {
    params.content = '你发送的是：'+params.receive.MsgType+' 类型，语音消息媒体id: '+
        params.receive.MediaId+' 语音格式: '+params.receive.Format;
    end(params,callback);
}
function replyVideoMsg(params,callback) {
    params.content = '你发送的是：'+params.receive.MsgType+' 类型，视频消息媒体id: '+
        params.receive.MediaId+' 视频消息缩略图的媒体id: '+params.receive.ThumbMediaId;
    end(params,callback);
}
function replyLocationMsg(params,callback) {
    params.content = '你发送的是：'+params.receive.MsgType+' 类型，地理位置维度: '+
        params.receive.Location_X + ' 地理位置经度: ' + params.receive.Location_Y +
        ' 地图缩放大小: '+ params.receive.Scale + ' 地理位置信息: '+ params.receive.Label;
    end(params,callback);
}
function replyLinkMsg(params,callback) {
    params.content = '你发送的是：'+params.receive.MsgType+' 类型，链接标题是：'+
        params.receive.Title + '，内容描述：'+ params.receive.Description +
        ' 链接：' + params.receive.Url;
    end(params,callback);
}
function replyEventMsg(params,callback) {
    switch (params.receive.Event)
    {
        case 'subscribe':
            myUrl.sendWelcomeMsg(params.receive.FromUserName);
            params.content = null;
            end(params,callback);
            break;
        case 'CLICK':
            // console.log(params.receive.EventKey);
            params = doEvent(params,callback);
            break;
        default:
    }
}
function doEvent(params,callback) {
    switch (params.receive.EventKey)
    {
        case 'setDayRemindOpen':        //开启当日提醒
            db.query("update users set dayRemind=1 where openId=?",[params.receive.FromUserName],function (error, res) {
                if(res && res.affectedRows)
                {
                    if(res.changedRows)
                    {
                        params.content = '成功开启当日提醒';
                    }else{
                        params.content = '已经开启了当日提醒，请勿重复开启';
                    }
                }else{
                    params.content = '开启当日提醒失败，请重试';
                }
                end(params,callback);
            });
            break;
        case 'setBeforeRemindOpen':
            db.query("update users set beforeRemind=1 where openId=? ",[params.receive.FromUserName],function (error, res) {
                if(res && res.affectedRows)
                {
                    if(res.changedRows)
                    {
                        params.content = '成功开启课前提醒';
                    }else{
                        params.content = '已经开启了课前提醒，请勿重复开启';
                    }
                }else{
                    params.content = '开启课前提醒失败，请重试';
                }
                end(params,callback);
            });
            break;
        case 'setDayRemindClose':
            db.query("update users set dayRemind=0 where openId=? ",[params.receive.FromUserName],function (error, res) {
                if(res && res.affectedRows)
                {
                    if(res.changedRows)
                    {
                        params.content = '成功关闭当日提醒';
                    }else{
                        params.content = '已经关闭了当日提醒，请勿重复开启';
                    }
                }else{
                    params.content = '关闭当日提醒失败，请重试';
                }
                end(params,callback);
            });
            break;
        case 'setBeforeRemindClose':
            db.query("update users set beforeRemind=0 where openId=? ",[params.receive.FromUserName],function (error, res) {
                if(res && res.affectedRows)
                {
                    if(res.changedRows)
                    {
                        params.content = '成功关闭课前提醒';
                    }else{
                        params.content = '已经关闭了课前提醒，请勿重复开启';
                    }
                }else{
                    params.content = '关闭课前提醒失败，请重试';
                }
                end(params,callback);
            });
            break;
        case 'getRemindStatus':
            db.query("select dayRemind,beforeRemind from users where openid=? limit 0,1",[params.receive.FromUserName],function (error, res) {
                var content = '';
                content += '当日提醒状态：';
                if(res[0].dayRemind)
                {
                    content += '开启， ';
                }else{
                    content += '关闭， ';
                }
                content += '课前提醒状态：';
                if(res[0].beforeRemind)
                {
                    content += '开启'
                }else{
                    content += '关闭';
                }
                params.content = content;
                end(params,callback);
            });
            break;
        case 'getSchedule':
            params.content = '发送"s:第几周"，如"s:13"，就可以获取第13周的课表';
            end(params,callback);
            break;
        default:
            params.content = null;
            end(params,callback);
    }
}
function end(params,callback) {
    callback(params);
}
exports.doPost = doPost;
exports.doGet = doGet;
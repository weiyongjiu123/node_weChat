var http = require('https');
var appId = 'wx730b7f9a60839346';
var appSecret = 'ecd6e74ad59d995a23ebe19cc5dc814f';
var accessToken = {
    value:null,
    time:0
};
var fs = require("fs");
// function setAccessToken(accessTok) {
//     accessToken = accessTok;
// }
// function getAccessToken() {
//     return accessToken;
// }

var day = {
    1:'一',
    2:'二',
    3:'三',
    4:'四',
    5:'五',
    6:'六',
    7:'日'
};
var daySchedule = {
    1:['oneCla','oneCou'],
    2:['twoCla','twoCou'],
    3:['threeCla','threeCou'],
    4:['fourCla','fourCou'],
    5:['fiveCla','fiveCou'],
    6:['sixCla','sixCou'],
    7:['sevenCla','sevenCou'],
    8:['eightCla','eightCou']
};

exports.get = function (url, callBack) {
    var buffer = '';
    var req = http.request(url, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk ) {
            buffer += chunk;
        });
        res.on('end',function () {
            callBack(buffer);
        })
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
};


exports.init=function () {
    var url = {
        host:'api.weixin.qq.com',
        path:'/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+appSecret,
    };
    post(url,function (data) {
        var json = JSON.parse(data);
        if(json.access_token)
        {
            accessToken.value = json.access_token;
            accessToken.time = getNowTime() + parseInt(json.expires_in);
        }
        // console.log("get accessToken");
    });
}
//计算中文的长度，按utf-8计算
function getStrLeng(str){
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for(var i = 0; i < len; i++){
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        }else{
            // 如果是中文则长度加3
            realLength += 3;
        }
    }
    return realLength;
}
function post(url,cb,content) {
    content = content || {};
    content = JSON.stringify(content);
    var options = {
        host:url.host,
        path:url.path,
        method:'POST',
        headers:{
            'Content-Type':'x-www-form-urlencoded',
            'Content-Length':getStrLeng(content)
        }
    };
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data',function(data){
            cb(data);
        });
    });
    req.write(content,'utf-8');
    req.end();
};


function getNowTime() {
    var timestamp = Date.parse(new Date());
    return timestamp / 1000;
}
function setAccessToken(cb) {
    if(accessToken.time > getNowTime())
    {
        cb(accessToken.value);
        return;
    }
    var url = {
        host:'api.weixin.qq.com',
        path:'/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+appSecret,
    };
    post(url,function (data) {
        // var json =data;
        var json = JSON.parse(data);
        if(json.access_token)
        {
            accessToken.value = json.access_token;
            accessToken.time = getNowTime() + parseInt(json.expires_in);
        }
        console.log("get accessToken");
        cb(json.access_token);
    });
}
exports.sendSchedule = function (schedule,week,toUserName) {
    var content = {};
    var sendContentQue = [];
      for(var k in schedule)
      {
          content['week'] = {
              value:week
          };
          content['day'] = {
              value:day[k]
          };
          for (var key in daySchedule)
          {
              if(schedule[k][key]['classroom'])
              {
                  content[daySchedule[key][0]] = {
                      value:schedule[k][key]['classroom']
                  };
                  content[daySchedule[key][1]] = {
                      value:schedule[k][key]['subject']
                  }
              }
          }
          var sendContent = {
              'touser':toUserName,
              'template_id':'tnuaDngDoZC-Ui-g6jw2Ss6OgW3yikH8Aic0SYGag-c',
              'data':content
          };
          var url = {
              host:'api.weixin.qq.com',
              path:'/cgi-bin/message/template/send?access_token='
          };
          // console.log(sendContent);
          sendTemplateMsg(url,sendContent);
          // sendContentQue.push(sendContent);
          content = {};
      }
    // var url = {
    //     host:'api.weixin.qq.com',
    //     path:'/cgi-bin/message/template/send?access_token='
    // };
      //因为时间关系，此处用了最笨的方法
    // sendTemplateMsg(url,sendContentQue[0],function () {
    //     sendTemplateMsg(url,sendContentQue[1],function () {
    //         sendTemplateMsg(url,sendContentQue[2],function () {
    //             sendTemplateMsg(url,sendContentQue[3],function () {
    //                 sendTemplateMsg(url,sendContentQue[5],function () {
    //                     sendTemplateMsg(url,sendContentQue[6],function () {
    //
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // });
};
exports.sendWelcomeMsg = function (toUserName) {
    var content = {
        'touser':toUserName,
        'template_id':'j3nXKTJJzf_Xt-5Jutusvr8g4ICAs6L2BPeyYmdB_ro'
    };
    var url = {
        host:'api.weixin.qq.com',
        path:'/cgi-bin/message/template/send?access_token='
    };
    sendTemplateMsg(url,content);
};
function sendTemplateMsg(url,content,sendCallBack) {
    setAccessToken(function (accessTokenValue) {
       url.path += accessTokenValue;
        // console.log(content);
       post(url,function (data) {
           var json =  JSON.parse(data);
          if(sendCallBack)
          {
              sendCallBack();
          }
       },content);
    });
};






var http = require('https');
var appId = 'wx730b7f9a60839346';
var appSecret = 'ecd6e74ad59d995a23ebe19cc5dc814f';
var accessToken = {
    value:null,
    time:0
};
var fs = require("fs");

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
};
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
        // console.log("get accessToken");
        cb(json.access_token);
    });
}
function sendTemplateMsg(url,content,sendCallBack) {
    setAccessToken(function (accessTokenValue) {

       url.path += accessTokenValue;

       post(url,function (data) {
           var json =  JSON.parse(data);
           // console.log(json);
          if(sendCallBack)
          {
              sendCallBack();
          }
       },content);
    });
}

exports.sendTemplateMsg = sendTemplateMsg;






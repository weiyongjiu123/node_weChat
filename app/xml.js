var tools = require('./tools');
var xmlElem = {
    text :{
        ToUserName:true,
        FromUserName:true,
        CreateTime:false,
        MsgType:true,
        Content:true
    },
    image:{
        PicUrl:true,
        MediaId:true
    },
    voice:{
        MediaId:true,
        Format:true
    },
    video:{
        MediaId:true,
        ThumbMediaId:true
    },
    location:{
        Location_X:false,
        Location_Y:false,
        Scale:false,
        Label:true
    },
    link:{
        Title:true,
        Description:true,
        Url:true
    },
    event:{
        Event:true,
        EventKey:true
    }
};


exports.getJsonByXml =function(xml){
    var json = tools.xmlToJson(xml,xmlElem.text);
    if(json.MsgType != 'text')
    {
        var appendJson = tools.xmlToJson(xml,xmlElem[json.MsgType])
        for(var k in appendJson)
        {
            json[k] = appendJson[k];
        }
    }
    return json;
};
exports.replyTextMsg = function(json){
    var xml = 'success';
   if(json.content != null)
   {
       var timestamp = Date.parse(new Date());
       timestamp = timestamp / 1000;
       xml = tools.jsonToXml({
           ToUserName:json.receive.FromUserName,
           FromUserName:json.receive.ToUserName,
           CreateTime:timestamp,
           MsgType:'text',
           Content:json.content
       });
   }
    json.res.end(xml);
};
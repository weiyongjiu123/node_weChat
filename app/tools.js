
exports.xmlToJson = function(xml,elemJson){
    var str = null;
    var res = null;
    var json = {};
    for(var k in elemJson)
    {
        if(elemJson[k])
        {
            str = new RegExp('<'+k+'><!\\[CDATA\\[([\\S\\s]*)\\]\\]></'+k+'>');
        }else{
            str = new RegExp('<'+k+'>([\\S\\s]*)</'+k+'>');
        }
        res = xml.match(str);
        if(res)
        {
            json[k] = res[1];
        }
    }
    return json;
};
exports.jsonToXml = function (json) {
    var str = '<xml>';
    for(var k in json)
    {
        if(isNaN(Number(json[k])))
        {
            str += '<'+k+'><![CDATA['+json[k]+']]></'+k+'>';
        }else{
            str += '<'+k+'>'+json[k]+'</'+k+'>';
        }
    }
    str += '</xml>';
    return str;
}
exports.call_user_func = function(cb, params) {
	var func = window[cb];
	func.apply(cb, params);
}


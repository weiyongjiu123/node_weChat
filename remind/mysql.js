var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'weChatPublic'
});

// connection.connect();

exports.query = function(sql,params,callBack){
    connection.query(sql,params,function (error, result) {
        if(callBack){
            callBack(error,result)
        }
    })
};

exports.closeDb = function () {
    connection.end()
};
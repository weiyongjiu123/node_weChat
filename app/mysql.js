var mysql      = require('mysql');
var db = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'weChatPublic'
};
var conn = null;
function connect() {
    conn = mysql.createConnection(db);
    conn.on('error',function (err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
        {
            connect();
        }else{
            throw err;
        }
    });
}
exports.getConn  = function () {
    connect();
    return conn;
}
// function Mysql() {
//     this.db = null;
//     this.connect = function () {
//         this.db = mysql.createConnection(db);
//     };
//     this.query = function (sql,cb) {
//         this.db.query(sql,function (error, result, fields) {
//             cb(result);
//         })
//     };
//     this.exec = function (sql,paramArr,cb) {
//         this.db.query(sql,paramArr,function (err, result) {
//             cb(result);
//         });
//     };
//     this.connect();
// }
// function test() {
//     var d = new Mysql();
//     d.query("select * from user",function (res) {
//         console.log(res);
//         d.db.end();
//         console.log(d.db);
//     });
    // d.exec("insert into user(username) values(?)",['你是'],function (res) {
    //     console.log(res);
    // });

// }
// test();
// connection.connect();
//
// var addSql = "insert into user(username) values(?)";
// var sqlParam = [];
//
// connection.query('select * from user', function (error, results, fields) {
//     if (error) throw error;
//     console.log(fields);
// });
// connection.end();
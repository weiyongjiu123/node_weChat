var mysql = require('./mysql');

exports.getUserMsg = function (callBack) {
    mysql.query("select id,schedule from users where login=1 and subscribe=1",[],callBack)
};

exports.closeDb = function () {
    mysql.closeDb();
};

exports.setTodaySchedule = function (schedule,id,callBack) {
    mysql.query("update users set todaySchedule=? where id=?",[schedule,id],callBack);
};

exports.getDayRemindSch = function (callBack) {
  mysql.query("select openId,todaySchedule from users where dayRemind=1 and subscribe=1 and login=1",[],callBack);
};

exports.getBeforeRemind = function (callBack) {
    mysql.query("select openId,todaySchedule from users where beforeRemind=1 and subscribe=1 and login=1",[],callBack);
}
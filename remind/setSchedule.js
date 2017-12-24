var userDao = require('./userDao');
var fs = require('fs');

var week ;
var day ;
var timeFile = __dirname+'/time.json';

function index() {
    updateTime();
    userDao.getUserMsg(function (error, result) {
        result.forEach(function (value) {
            setSchedule(value);
        })
    });
}

function setSchedule(userMsg) {
    var id = userMsg['id'];
    var schedule = JSON.parse(userMsg['schedule']);
    var todaySchedule = schedule[week][day];
    for(var key in todaySchedule){
        var classroom = new String(todaySchedule[key]['classroom']);
        var isOnlineClass = classroom.match(/^ZX[\S\s]*$/);
        if(!todaySchedule[key]['classroom'] || isOnlineClass ){
            delete todaySchedule[key]
        }
    }
    userDao.setTodaySchedule(JSON.stringify(todaySchedule),id,function (error, result) {
    });
}

function updateTime() {
    var time = fs.readFileSync(timeFile);
    time = JSON.parse(time);
    week = time.week;
    day = time.day;
    var newTime = {};
    if(day >= 7)
    {
        newTime.week = week + 1;
        newTime.day = 1;
    }else{
        newTime.day = day + 1;
        newTime.week = week
    }
    fs.writeFile(timeFile,JSON.stringify(newTime),function (err) {

    })
}



exports.index = index;
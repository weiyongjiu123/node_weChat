var setSchedule = require('./setSchedule');
var dayRemind = require('./dayRemind');
var beforeRemind = require('./beforeRemind');
var userDao = require('./userDao');

var argv = process.argv.splice(2);
// [ '1', '2', '3' ]
switch (argv[0])
{
    case 'setSchedule':
        setSchedule.index();
        break;
    case 'dayRemind':
        dayRemind.index();
        break;
    case 'beforeRemind':
        beforeRemind.index(argv[1]);
        break;
}

setTimeout(function () {
    userDao.closeDb();
},10000);
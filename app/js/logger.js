var customLogLevels = {
    levels: {
        verb:  0,
        debug: 1,
        info:  2,
        warn:  3,        
        error: 4
    },
    colors: {
        verb:  'cyan',
        debug: 'magenta',
        info:  'green',
        warn:  'yellow',        
        error: 'red'
    }
};

// timestamp formatter
var dateFormat = require('dateformat');

function logTimeStamp() {
    return dateFormat('yyyy-mm-dd HH:MM:ss');
};

var config = require('./config');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [],
    levels:     customLogLevels.levels,
    colors:     customLogLevels.colors,
    padLevels:  true
});
if (config.log) {
    // console logging defined
    if (config.log.console) {
        logger.add(winston.transports.Console, {
            level:       config.log.console.level,
            colorize:    config.log.console.colorize,
            prettyPrint: true,
            timestamp:   logTimeStamp,
            handleExceptions: true,
        });
    }
   // file logging defined
    if ( config.log.file ) {
        logger.add(winston.transports.File, {
            level:       config.log.file.level,
            colorize:    config.log.file.colorize,
            prettyPrint: true,
            timestamp:   logTimeStamp,
            filename:    config.log.file.name,
            //dirname:     './log',
            maxsize:     1000000,
            maxFiles:    50,
            json:        false,
            handleExceptions: true,
        });

        // log a section separator in file, turn of console output first, if any
        if ( logger.transports.console )
            logger.transports.console.silent = true;

        logger.info('\n\n\n');
        logger.info('---------------------------------------------');
        logger.info('            START OF LOG SECTION ');
        logger.info('---------------------------------------------');

        if ( logger.transports.console )
            logger.transports.console.silent = false;
    }
}
logger.on('error', function(err) {
    console.log('Logger Error: ' + err);
});
exports = module.exports = logger;
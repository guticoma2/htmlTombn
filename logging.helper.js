const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

const path = require('path');

const defaultLogPath = './';

const logLevel = {
    error:   'ERROR  ',
    warning: 'WARNING',
    info:    'INFO   ',
    success: 'SUCCESS',
}

const Log = (lpath = defaultLogPath) => {
    const logPath = path.join(lpath, `${moment().format('YYYYMMDD_HH_mm_ss')}mbn.log`);
 
    const create = () => {
        try {
            fs.writeFileSync(logPath, '');
        } catch(err) {
            // do nothing
        }
    };
    const append = msg => {
        try {
            fs.appendFileSync(logPath, msg);
        } catch(err) {
            // do nothing
        }
    };
    const exists = () => {
        try {
            return fs.existsSync(logPath)
        } catch(err) {
            return false;
        }
    };
    const getColor = level => {
        switch(level) {
            case logLevel.error:
                return chalk.red(level);
            case logLevel.warning:
                return chalk.yellow(level);
            case logLevel.info:
                return chalk.blue(level)
            case logLevel.success:
                return chalk.green(level);
        }
    };
    const setVerbose = (isVerbose = false) => this.isVerbose = isVerbose;
    const createMsg = (msg, date, level, isConsole) =>  createNewLine(`${isConsole ? '' : date.format('YYYY/MM/DD HH:mm:ss')} ${isConsole ? getColor(level) : level}  -> ${msg}`);
    const createNewLine = msg => `\n ${msg}`;
    const log = (msg, level = logLevel.error) => {
        if (!this.isVerbose && level === logLevel.info) return; 
        const date = moment();
        console.log(createMsg(msg, date, level, true));
        append(createMsg(msg, date, level, false));
    };
    const error = msg => log(msg, logLevel.error);
    const warning = msg => log(msg, logLevel.warning);
    const info = msg => log(msg, logLevel.info);
    const success = msg => log(msg, logLevel.success); 

    if(!exists()) create();

    return {
        log,
        error,
        warning,
        info,
        success,
        setVerbose,
    }
};

Log.level = logLevel;

const singLog = Log();

module.exports = {
   Log: singLog,
};
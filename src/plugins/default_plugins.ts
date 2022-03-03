
import type { LogRecord, LevelsNumber, Plugin } from '../types.ts'

const levelsNameToNumbers: LevelsNumber = {
    debug: 0,
    info: 10,
    table: 10,
    warn: 20,
    warning: 20,
    error: 30,
    critical: 40,
    fatal: 40,
}
const levelsNumbersToMethod: { [level: number]: string } = {
    0: 'debug',
    10: 'info',
    20: 'warn',
    30: 'error',
    40: 'error',
}

export function applyLevel(log: LogRecord): LogRecord {
    log.levelNumber = levelsNameToNumbers[log.methodName] ?? 0;
    return log;
}

export function filterBaseOnLevel(level: string): Plugin {
    level = level.toLowerCase();
    return (log: LogRecord): LogRecord => {
        log.muted = log.levelNumber < levelsNameToNumbers[level];
        return log;
    }
}

export function transportToConsole(log: LogRecord): LogRecord {
    if (!log.muted) {
        // @ts-ignore
        const fn = console[log.methodName]
            // @ts-ignore
            ?? console[levelsNumbersToMethod[log.levelNumber]];

        const args = log.msg ? [log.msg] : log.args;
        fn(...args);
    }
    return log;

}

export function returnArgs(log: LogRecord): LogRecord {
    log.returned = log.args;
    return log;
}

import logger, {  console } from "../mod.ts";
// import type { MiddlewareNext } from "../src/types.ts";
import { assertEquals, stub } from "../dev_deps.ts";


Deno.test({
    name: "[levels] no found method should log to debug method",
    ignore: false,
    // only: true,
    fn: () => {
        const debug = stub(console, "debug");
        logger.debug('debug');
        logger.silly('silly');
        logger.verbose('verbose');
        assertEquals(debug.calls.length, 3);
        debug.restore();
    },
});


Deno.test({
    name: "[levels] info level",
    ignore: false,
    // only: true,
    fn: () => {
        const info = stub(console, "info");
        // logger.log('log');
        logger.info('info');
        logger.success('success');
        logger[200]('200');
        logger[202]('202');
        logger[204]('204');
        logger['204']('204');
        assertEquals(info.calls.length, 6);
        info.restore();
    },
});


Deno.test({
    name: "[levels] warning level",
    ignore: false,
    // only: true,
    fn: () => {
        const warn = stub(console, "warn");
        logger.warn('warn');
        logger.warning('warning');
        logger[300]('300');
        logger[303]('303');
        logger[304]('304');
        logger['304']('304');
        logger[404]('404');
        logger[400]('400');
        assertEquals(warn.calls.length, 8);
        warn.restore();
    },
});




Deno.test({
    name: "[levels] error level",
    ignore: false,
    // only: true,
    fn: () => {
        const error = stub(console, "error");
        logger.error('error');
        logger.catch('catch');
        logger[500]('500');
        logger[503]('503');
        logger[504]('504');
        logger['504']('504');
        assertEquals(error.calls.length, 6);
        error.restore();
    },
});



Deno.test({
    name: "[levels] critical level",
    ignore: true,
    // only: true,
    fn: () => {
        const critical = stub(console, "critical");
        logger.critical('critical');
        logger.important('important');
        logger.fatal('fatal');
        assertEquals(critical.calls.length, 6);
        critical.restore();
    },
});
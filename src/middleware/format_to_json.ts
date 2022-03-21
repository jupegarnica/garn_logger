import type { MiddlewareContext, MiddlewareNext } from "../types.ts";


export function formatToJson(
    { logRecord }: MiddlewareContext,
    next: MiddlewareNext,
) {
    logRecord.json = JSON.stringify(logRecord);
    next();
    logRecord.willReturn = logRecord.json;
    return logRecord;
}
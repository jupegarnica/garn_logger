import logger, { formatToAnsiColors } from "./mod.ts";

logger.setFilter("VERBOSE");
logger.use(formatToAnsiColors({ multiline: false }));

export { logger };
export default logger;

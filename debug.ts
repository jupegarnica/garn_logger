import logger, { applyFilter } from "./mod.ts";

logger.use(
  applyFilter(
    "error",
  ),
);

logger.silly("logger.silly");
// logger.debug("logger.debug");
// logger.log("logger.log");
// logger.info("logger.info");
// logger.warn("logger.warn");
// logger.error("logger.error");
logger.critical("LOGGER.CRITICAL");

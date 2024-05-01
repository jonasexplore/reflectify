import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  translateTime: "SYS:h:MM:ss TT",
  ignore: "pid,hostname",
});

export const logger = pino({}, stream);

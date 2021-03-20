import { interfaces } from "cheeket";
import {
  createLogger,
  Logger,
  LoggerOptions,
  transport as Transport,
} from "winston";

function loggerProvider(
  transportToken: interfaces.Token<Transport>,
  options?: LoggerOptions
): interfaces.Provider<Logger> {
  return async (context) => {
    return createLogger({
      transports: await context.resolveAll(transportToken),
      ...options,
    });
  };
}

export default loggerProvider;

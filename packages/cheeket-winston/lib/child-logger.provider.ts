import { interfaces } from "cheeket";
import { Logger } from "winston";

function childLoggerProvider(
  loggerToken: interfaces.Token<Logger>,
  options?: Record<string, unknown>
): interfaces.Provider<Logger> {
  return async (context) => {
    const logger = await context.resolve(loggerToken);
    return logger.child(options as never);
  };
}

export default childLoggerProvider;

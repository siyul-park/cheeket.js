import { interfaces } from "cheeket";
import { transport as Transport, transports } from "winston";

function consoleTransportProvider(
  options?: transports.ConsoleTransportOptions
): interfaces.Provider<Transport> {
  return async () => new transports.Console(options);
}

export default consoleTransportProvider;

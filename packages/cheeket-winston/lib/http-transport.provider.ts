import { interfaces } from "cheeket";
import { transport as Transport, transports } from "winston";

function httpTransportProvider(
  options?: transports.HttpTransportOptions
): interfaces.Provider<Transport> {
  return async () => new transports.Http(options);
}

export default httpTransportProvider;

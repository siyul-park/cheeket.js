import { interfaces } from "cheeket";
import { transport as Transport, transports } from "winston";

function fileTransportProvider(
  options?: transports.FileTransportOptions
): interfaces.Provider<Transport> {
  return async () => new transports.File(options);
}

export default fileTransportProvider;

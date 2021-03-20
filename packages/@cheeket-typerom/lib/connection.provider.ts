import { interfaces } from "cheeket";
import { Connection, createConnection, ConnectionOptions } from "typeorm";

function connectionProvider(
  options: ConnectionOptions
): interfaces.Provider<Connection> {
  return async () => createConnection(options);
}

export default connectionProvider;

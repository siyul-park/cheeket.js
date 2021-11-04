import Token from "./token";
import Provider from "./provider";

interface Register {
  register<T>(token: Token<T>, provider: Provider<T>): this;
}

export default Register;

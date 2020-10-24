import AccessLimiter from "./access-limiter";

interface BindingAsSyntax<T> {
  as(accessLimiter: AccessLimiter): void;
  asPublic(): void;
  asProtected(): void;
  asPrivate(): void;
}

export default BindingAsSyntax;

import Resolver from "./resolver";

interface ResolverChain {
  resolver: Resolver;

  parent: ResolverChain | undefined;
}

export default ResolverChain;

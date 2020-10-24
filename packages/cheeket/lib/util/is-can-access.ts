import AccessLimiter from "../interface/access-limiter";

function isCanAccess(required: AccessLimiter, wanted: AccessLimiter): boolean {
  if (required === AccessLimiter.Public) {
    return true;
  }
  if (required === AccessLimiter.Private) {
    return wanted === AccessLimiter.Private;
  }
  return false;
}

export default isCanAccess;

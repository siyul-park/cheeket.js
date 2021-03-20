import { interfaces } from "cheeket";

import MetadataKey from "../constant/metadata-key";
import ErrorMsg from "../constant/error-msg";
import ClassDecorator from "./class-decorator";

function injectable<T>(): ClassDecorator<T> {
  return (target: interfaces.Type<T>) => {
    if (Reflect.hasOwnMetadata(MetadataKey.ParamTypes, target)) {
      throw new Error(ErrorMsg.DuplicatedInjectableDecorator);
    }

    const types =
      Reflect.getMetadata(MetadataKey.DesignParamTypes, target) ?? [];
    Reflect.defineMetadata(MetadataKey.ParamTypes, types, target);

    return target;
  };
}

export default injectable;

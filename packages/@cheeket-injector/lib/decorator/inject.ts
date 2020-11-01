import { interfaces } from "cheeket";
import MetadataKey from "../constant/metadata-key";
import MetaData from "../meta-data/meta-data";

function inject<T>(token: interfaces.Token<T>): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    const metaDataList: MetaData<number, interfaces.Token<unknown>>[] =
      Reflect.getMetadata(MetadataKey.ParamTokens, target) ?? [];

    metaDataList.push(
      new MetaData<number, interfaces.Token<T>>(parameterIndex, token)
    );

    Reflect.defineMetadata(MetadataKey.ParamTokens, metaDataList, target);

    return target;
  };
}

export default inject;

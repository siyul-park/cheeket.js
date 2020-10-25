import MetadataKey from "../constant/metadata-key";
import ErrorMsg from "../constant/error-msg";
import Identifier from "../identifier/identifier";
import MetaData from "../meta-data/meta-data";

function inject<T>(id: Identifier<T>): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    const metaDataList: MetaData<number, Identifier<unknown>>[] =
      Reflect.getMetadata(MetadataKey.ParamIds, target) ?? [];

    metaDataList.push(new MetaData<number, Identifier<T>>(parameterIndex, id));

    Reflect.defineMetadata(MetadataKey.ParamIds, metaDataList, target);

    return target;
  };
}

export default inject;

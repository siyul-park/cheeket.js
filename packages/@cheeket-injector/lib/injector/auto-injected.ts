import { Identifier, Provider } from "cheeket";
import Type from "../type/type";
import MetadataKey from "../constant/metadata-key";
import MetaData from "../meta-data/meta-data";

function autoInjected<T>(Target: Type<T>): Provider<T> {
  return async (lookUp) => {
    const types: Type<unknown>[] = Reflect.getMetadata(
      MetadataKey.ParamTypes,
      Target
    );
    const metaDataList: MetaData<number, Identifier<unknown>>[] =
      Reflect.getMetadata(MetadataKey.ParamIds, Target) ?? [];

    const idMap = new Map<number, Identifier<unknown>>();
    metaDataList.forEach((metaData) => idMap.set(metaData.key, metaData.value));

    const parameters = await Promise.all(
      types.map((type, index) => {
        const id = idMap.get(index);
        if (id !== undefined) {
          return lookUp.resolve(id);
        }
        return lookUp.resolve(type);
      })
    );

    return new Target(...parameters);
  };
}

export default autoInjected;

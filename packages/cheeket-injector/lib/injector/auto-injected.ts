import { interfaces } from "cheeket";
import MetadataKey from "../constant/metadata-key";
import MetaData from "../meta-data/meta-data";

function autoInjected<T>(Target: interfaces.Type<T>): interfaces.Provider<T> {
  return async (context: interfaces.Context) => {
    const types: interfaces.Type<unknown>[] = Reflect.getMetadata(
      MetadataKey.ParamTypes,
      Target
    );
    const metaDataList: MetaData<number, interfaces.Token<unknown>>[] =
      Reflect.getMetadata(MetadataKey.ParamTokens, Target) ?? [];

    const idMap = new Map<number, interfaces.Token<unknown>>();
    metaDataList.forEach((metaData) => idMap.set(metaData.key, metaData.value));

    const parameters = await Promise.all(
      types.map((type, index) => {
        const id = idMap.get(index);
        if (id !== undefined) {
          return context.resolve(id);
        }
        return context.resolve(type);
      })
    );

    return new Target(...(parameters as never[]));
  };
}

export default autoInjected;

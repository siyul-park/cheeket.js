type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json
  | JsonArray;

interface Json {
  [x: string]: JsonValue;
}

type JsonArray = Array<JsonValue>;

export default Json;

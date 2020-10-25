import Type from "./type";
import Abstract from "./abstract";

type Identifier<T> = string | symbol | Type<T> | Abstract<T>;

export default Identifier;

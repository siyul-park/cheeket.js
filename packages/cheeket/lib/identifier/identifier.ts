import Newable from "./newable";
import Abstract from "./abstract";

type Identifier<T> = string | symbol | Newable<T> | Abstract<T>;

export default Identifier;

import Type from "../type/type";

type ClassDecorator<T> = (target: Type<T>) => void;

export default ClassDecorator;

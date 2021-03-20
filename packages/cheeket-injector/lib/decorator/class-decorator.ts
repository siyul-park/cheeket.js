import { interfaces } from "cheeket";

type ClassDecorator<T> = (target: interfaces.Type<T>) => void;

export default ClassDecorator;

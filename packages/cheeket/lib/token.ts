import Type from './type';
import Abstract from './abstract';

type Token<T> = string | symbol | Type<T> | Abstract<T>;

export default Token;

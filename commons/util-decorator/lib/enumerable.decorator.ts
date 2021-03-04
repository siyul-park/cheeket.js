function enumerable(value: boolean): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    descriptor.enumerable = value;
  };
}

export default enumerable;

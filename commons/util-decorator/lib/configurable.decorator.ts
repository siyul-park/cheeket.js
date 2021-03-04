function configurable(value: boolean): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    descriptor.configurable = value;
  };
}

export default configurable;

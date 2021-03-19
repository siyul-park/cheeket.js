function writable(value: boolean): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    descriptor.writable = value;
  };
}

export default writable;

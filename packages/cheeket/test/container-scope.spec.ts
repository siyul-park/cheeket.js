import { Container, containerScope, asObject } from '../lib';

class Dummy {}

describe('containerScope', () => {
  test('multi', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const factory = containerScope(() => new Dummy());

    container1.register(Dummy, asObject(factory));
    container2.register(Dummy, asObject(factory));

    expect(factory.size).toEqual(0);

    const dummy1 = await container1.resolve(Dummy);
    const dummy2 = await container1.resolve(Dummy);

    expect(dummy1).toBe(dummy2);
    expect(factory.size).toEqual(1);

    const dummy3 = await container2.resolve(Dummy);
    const dummy4 = await container2.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).not.toBe(dummy3);
    expect(factory.size).toEqual(2);

    factory.delete(container1);
    expect(factory.size).toEqual(1);

    factory.delete(container2);
    expect(factory.size).toEqual(0);
  });

  test('child', async () => {
    const parent = new Container();
    const child = parent.createChild();

    const factory = containerScope(() => new Dummy());

    parent.register(Dummy, asObject(factory));

    expect(factory.size).toEqual(0);

    const dummy1 = await child.resolve(Dummy);
    const dummy2 = await child.resolve(Dummy);

    expect(dummy1).toBe(dummy2);
    expect(factory.size).toEqual(1);

    const dummy3 = await parent.resolve(Dummy);
    const dummy4 = await parent.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(factory.size).toEqual(1);
    expect(dummy1).toBe(dummy3);

    parent.clear();
    expect(factory.size).toEqual(0);
  });
});

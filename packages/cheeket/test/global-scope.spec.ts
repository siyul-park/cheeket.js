import { Container, globalScope, asObject } from '../lib';

class Dummy {}

describe('globalScope', () => {
  test('multi', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const factory = globalScope(() => new Dummy());

    container1.register(Dummy, asObject(factory));
    container2.register(Dummy, asObject(factory));

    const dummy1 = await container1.resolve(Dummy);
    const dummy2 = await container1.resolve(Dummy);

    expect(dummy1).toBe(dummy2);

    const dummy3 = await container2.resolve(Dummy);
    const dummy4 = await container2.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).toBe(dummy3);
  });

  test('child', async () => {
    const parent = new Container();
    const child = parent.createChild();

    const factory = globalScope(() => new Dummy());

    parent.register(Dummy, asObject(factory));

    const dummy1 = await child.resolve(Dummy);
    const dummy2 = await child.resolve(Dummy);

    expect(dummy1).toBe(dummy2);

    const dummy3 = await parent.resolve(Dummy);
    const dummy4 = await parent.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).toBe(dummy3);

    parent.clear();
  });
});

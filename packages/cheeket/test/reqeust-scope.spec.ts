import { Container, requestScope, asObject } from '../lib';

class Dummy {}

describe('requestScope', () => {
  test('multi', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const factory = requestScope(() => new Dummy());

    container1.register(Dummy, asObject(factory));
    container2.register(Dummy, asObject(factory));

    const dummy1 = await container1.resolve(Dummy);
    const dummy2 = await container1.resolve(Dummy);

    expect(dummy1).not.toBe(dummy2);

    const dummy3 = await container2.resolve(Dummy);
    const dummy4 = await container2.resolve(Dummy);

    expect(dummy3).not.toBe(dummy4);
    expect(dummy1).not.toBe(dummy3);
  });

  test('child', async () => {
    const parent = new Container();
    const child = parent.child();

    const factory = requestScope(() => new Dummy());

    parent.register(Dummy, asObject(factory));

    const dummy1 = await child.resolve(Dummy);
    const dummy2 = await child.resolve(Dummy);

    expect(dummy1).not.toBe(dummy2);

    const dummy3 = await parent.resolve(Dummy);
    const dummy4 = await parent.resolve(Dummy);

    expect(dummy3).not.toBe(dummy4);
    expect(dummy1).not.toBe(dummy3);

    await parent.clear();
  });
});

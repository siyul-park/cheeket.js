import { Container, containerScope, asArray, Token } from '../lib';

class Dummy {}
const DummyArray = Symbol('Dummy[]') as Token<Dummy[]>;

describe('asArray', () => {
  test('multi', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const factory1 = containerScope(() => new Dummy());
    const factory2 = containerScope(() => new Dummy());

    container1.register(DummyArray, asArray(factory1));
    container1.register(DummyArray, asArray(factory2));

    container2.register(DummyArray, asArray(factory1));
    container2.register(DummyArray, asArray(factory2));

    expect(factory1.size).toEqual(0);
    expect(factory2.size).toEqual(0);

    const dummy1 = await container1.resolve(DummyArray);
    const dummy2 = await container1.resolve(DummyArray);

    expect(dummy1.length).toBe(2);
    expect(dummy2.length).toBe(2);

    expect(dummy1[0]).toBe(dummy2[0]);
    expect(dummy1[1]).toBe(dummy2[1]);

    expect(factory1.size).toEqual(1);
    expect(factory2.size).toEqual(1);

    const dummy3 = await container2.resolve(DummyArray);
    const dummy4 = await container2.resolve(DummyArray);

    expect(dummy3.length).toBe(2);
    expect(dummy4.length).toBe(2);

    expect(dummy3[0]).toBe(dummy4[0]);
    expect(dummy3[1]).toBe(dummy4[1]);

    expect(dummy1[0]).not.toBe(dummy3[0]);
    expect(dummy1[1]).not.toBe(dummy3[1]);

    expect(factory1.size).toEqual(2);
    expect(factory2.size).toEqual(2);

    container1.clear();
    expect(factory1.size).toEqual(1);
    expect(factory2.size).toEqual(1);

    container2.clear();
    expect(factory1.size).toEqual(0);
    expect(factory2.size).toEqual(0);
  });

  test('child', async () => {
    const parent = new Container();
    const child = parent.createChild();

    const factory1 = containerScope(() => new Dummy());
    const factory2 = containerScope(() => new Dummy());

    parent.register(DummyArray, asArray(factory1));
    child.register(DummyArray, asArray(factory2));

    expect(factory1.size).toEqual(0);
    expect(factory2.size).toEqual(0);

    const dummy1 = await child.resolve(DummyArray);
    const dummy2 = await child.resolve(DummyArray);

    expect(dummy1.length).toBe(1);
    expect(dummy2.length).toBe(1);

    expect(dummy1[0]).toBe(dummy2[0]);

    expect(factory1.size).toEqual(0);
    expect(factory2.size).toEqual(1);

    child.clear();
    expect(factory2.size).toEqual(0);
  });
});

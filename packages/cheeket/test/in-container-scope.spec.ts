import { bindArray, bindObject, Container, inContainerScope, Token } from "../lib";

class Dummy {}
const DummyArray = Symbol("Dummy[]") as Token<Dummy[]>;

describe("inContainerScope", () => {
  test("bindObject", async () => {
    const container1 = new Container();
    const container2 = new Container();

    const provider = inContainerScope(() => new Dummy(), bindObject());

    container1.register(Dummy, provider);
    container2.register(Dummy, provider);

    expect(provider.size).toEqual(0);

    const dummy1 = await container1.resolve(Dummy);
    const dummy2 = await container1.resolve(Dummy);

    expect(dummy1).toBe(dummy2);
    expect(provider.size).toEqual(1);

    const dummy3 = await container2.resolve(Dummy);
    const dummy4 = await container2.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).not.toBe(dummy3);
    expect(provider.size).toEqual(2);

    container1.clear();
    expect(provider.size).toEqual(1);

    container2.clear();
    expect(provider.size).toEqual(0);
  });

  test("bindObject: child", async () => {
    const parent = new Container();
    const child = parent.createChild();

    const provider = inContainerScope(() => new Dummy(), bindObject());

    parent.register(Dummy, provider);

    expect(provider.size).toEqual(0);

    const dummy1 = await child.resolve(Dummy);
    const dummy2 = await child.resolve(Dummy);

    expect(dummy1).toBe(dummy2);
    expect(provider.size).toEqual(1);

    const dummy3 = await parent.resolve(Dummy);
    const dummy4 = await parent.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(provider.size).toEqual(1);
    expect(dummy1).toBe(dummy3);

    parent.clear();
    expect(provider.size).toEqual(0);
  });

  test("bindArray", async () => {
    const container1 = new Container();
    const container2 = new Container();

    const provider1 = inContainerScope(() => new Dummy(), bindArray());
    const provider2 = inContainerScope(() => new Dummy(), bindArray());

    container1.register(DummyArray, provider1);
    container1.register(DummyArray, provider2);

    container2.register(DummyArray, provider1);
    container2.register(DummyArray, provider2);

    expect(provider1.size).toEqual(0);
    expect(provider2.size).toEqual(0);

    const dummy1 = await container1.resolve(DummyArray);
    const dummy2 = await container1.resolve(DummyArray);

    expect(dummy1.length).toBe(2);
    expect(dummy2.length).toBe(2);

    expect(dummy1[0]).toBe(dummy2[0]);
    expect(dummy1[1]).toBe(dummy2[1]);

    expect(provider1.size).toEqual(1);
    expect(provider2.size).toEqual(1);

    const dummy3 = await container2.resolve(DummyArray);
    const dummy4 = await container2.resolve(DummyArray);

    expect(dummy3.length).toBe(2);
    expect(dummy4.length).toBe(2);

    expect(dummy3[0]).toBe(dummy4[0]);
    expect(dummy3[1]).toBe(dummy4[1]);

    expect(dummy1[0]).not.toBe(dummy3[0]);
    expect(dummy1[1]).not.toBe(dummy3[1]);

    expect(provider1.size).toEqual(2);
    expect(provider2.size).toEqual(2);

    container1.clear();
    expect(provider1.size).toEqual(1);
    expect(provider2.size).toEqual(1);

    container2.clear();
    expect(provider1.size).toEqual(0);
    expect(provider2.size).toEqual(0);
  });

  test("bindArray: child", async () => {
    const parent = new Container();
    const child = parent.createChild();

    const provider1 = inContainerScope(() => new Dummy(), bindArray());
    const provider2 = inContainerScope(() => new Dummy(), bindArray());

    parent.register(DummyArray, provider1);
    child.register(DummyArray, provider2);

    expect(provider1.size).toEqual(0);
    expect(provider2.size).toEqual(0);

    const dummy1 = await child.resolve(DummyArray);
    const dummy2 = await child.resolve(DummyArray);

    expect(dummy1.length).toBe(1);
    expect(dummy2.length).toBe(1);

    expect(dummy1[0]).toBe(dummy2[0]);

    expect(provider1.size).toEqual(0);
    expect(provider2.size).toEqual(1);

    child.clear();
    expect(provider2.size).toEqual(0);
  });
});

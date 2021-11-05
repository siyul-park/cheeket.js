import { bindArray, bindObject, Container, inGlobalScope, Token } from "../lib";

class Dummy {}
const DummyArray = Symbol("Dummy[]") as Token<Dummy[]>;

describe("inGlobalScope", () => {
  test("bindObject", async () => {
    const container1 = new Container();
    const container2 = new Container();

    const middleware = inGlobalScope(() => new Dummy(), bindObject());

    container1.register(Dummy, middleware);
    container2.register(Dummy, middleware);

    const dummy1 = await container1.resolve(Dummy);
    const dummy2 = await container1.resolve(Dummy);

    expect(dummy1).toBe(dummy2);

    const dummy3 = await container2.resolve(Dummy);
    const dummy4 = await container2.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).toBe(dummy3);
  });

  test("bindObject: child", async () => {
    const parent = new Container();
    const child = parent.createChild();

    const middleware = inGlobalScope(() => new Dummy(), bindObject());

    parent.register(Dummy, middleware);

    const dummy1 = await child.resolve(Dummy);
    const dummy2 = await child.resolve(Dummy);

    expect(dummy1).toBe(dummy2);

    const dummy3 = await parent.resolve(Dummy);
    const dummy4 = await parent.resolve(Dummy);

    expect(dummy3).toBe(dummy4);
    expect(dummy1).toBe(dummy3);

    parent.clear();
  });

  test("bindArray", async () => {
    const container1 = new Container();
    const container2 = new Container();

    const middleware1 = inGlobalScope(() => new Dummy(), bindArray());
    const middleware2 = inGlobalScope(() => new Dummy(), bindArray());

    container1.register(DummyArray, middleware1);
    container1.register(DummyArray, middleware2);

    container2.register(DummyArray, middleware1);
    container2.register(DummyArray, middleware2);

    const dummy1 = await container1.resolve(DummyArray);
    const dummy2 = await container1.resolve(DummyArray);

    expect(dummy1.length).toBe(2);
    expect(dummy2.length).toBe(2);

    expect(dummy1[0]).toBe(dummy2[0]);
    expect(dummy1[1]).toBe(dummy2[1]);

    const dummy3 = await container2.resolve(DummyArray);
    const dummy4 = await container2.resolve(DummyArray);

    expect(dummy3.length).toBe(2);
    expect(dummy4.length).toBe(2);

    expect(dummy3[0]).toBe(dummy4[0]);
    expect(dummy3[1]).toBe(dummy4[1]);

    expect(dummy1[0]).toBe(dummy3[0]);
    expect(dummy1[1]).toBe(dummy3[1]);
  });

  test("bindArray: child", async () => {
    const parent = new Container();
    const child = parent.createChild();

    const middleware1 = inGlobalScope(() => new Dummy(), bindArray());
    const middleware2 = inGlobalScope(() => new Dummy(), bindArray());

    parent.register(DummyArray, middleware1);
    child.register(DummyArray, middleware2);

    const dummy1 = await child.resolve(DummyArray);
    const dummy2 = await child.resolve(DummyArray);

    expect(dummy1.length).toBe(1);
    expect(dummy2.length).toBe(1);

    expect(dummy1[0]).toBe(dummy2[0]);
  });
});
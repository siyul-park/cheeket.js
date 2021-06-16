// eslint-disable-next-line max-classes-per-file
import { inContainerScope, inRequestScope, RootContainer, Token } from "../lib";

interface Wheel {
  getShape(): string;
}

interface Vehicle {
  getWheels(): Wheel[];
}

class RoundWheel implements Wheel {
  // eslint-disable-next-line class-methods-use-this
  getShape(): string {
    return "round";
  }
}

class SquareWheel implements Wheel {
  // eslint-disable-next-line class-methods-use-this
  getShape(): string {
    return "square";
  }
}

class Bus implements Vehicle {
  constructor(private readonly wheels: Wheel[]) {}

  getWheels(): Wheel[] {
    return this.wheels;
  }
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Token = Object.freeze({
  Wheels: Symbol("Wheel") as Token<Wheel[]>,
  Vehicle: Symbol("Vehicle") as Token<Vehicle>,
});

describe("InRequestScope", () => {
  test("only one container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inRequestScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new SquareWheel(), { array: true })
    );

    const wheels = await container.resolve(Token.Wheels);
    expect(wheels).toHaveLength(4);

    container.bind(
      Token.Vehicle,
      inRequestScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const vehicle = await container.resolve(Token.Vehicle);
    const other = await container.resolve(Token.Vehicle);

    expect(vehicle.getWheels()).toHaveLength(4);
    expect(vehicle !== other).toBeTruthy();

    container.close();
  });

  test("nested container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inRequestScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inRequestScope(() => new SquareWheel(), { array: true })
    );

    const childContainer = container.createChildContainer();
    const wheels = await childContainer.resolve(Token.Wheels);
    expect(wheels).toHaveLength(4);

    childContainer.bind(
      Token.Vehicle,
      inRequestScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const vehicle = await childContainer.resolve(Token.Vehicle);
    const other = await childContainer.resolve(Token.Vehicle);

    expect(vehicle.getWheels()).toHaveLength(4);
    expect(vehicle !== other).toBeTruthy();

    childContainer.close();
    container.close();
  });
});

describe("InContainerScope", () => {
  test("only one container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );

    const wheels = await container.resolve(Token.Wheels);
    expect(wheels).toHaveLength(4);

    container.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const vehicle = await container.resolve(Token.Vehicle);
    const other = await container.resolve(Token.Vehicle);

    expect(vehicle.getWheels()).toHaveLength(4);
    expect(vehicle === other).toBeTruthy();

    container.close();
  });

  test("nested container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );

    const childContainer = container.createChildContainer();
    const wheels = await childContainer.resolve(Token.Wheels);
    expect(wheels).toHaveLength(4);

    container.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    childContainer.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const vehicle = await childContainer.resolve(Token.Vehicle);
    const other = await childContainer.resolve(Token.Vehicle);
    const root = await childContainer.resolve(Token.Vehicle);

    expect(vehicle.getWheels()).toHaveLength(4);
    expect(vehicle === other).toBeTruthy();
    expect(vehicle === root).toBeTruthy();

    childContainer.close();
    container.close();
  });
});

describe("middleware", () => {
  test("only one container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );

    container.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const mockCallback = jest.fn(async (context, next) => {
      const before = context.response;
      await next();
      const after = context.response;

      expect(before).not.toEqual(after);
    });
    container.use(mockCallback);

    await container.resolve(Token.Vehicle);

    expect(mockCallback.mock.calls).toHaveLength(2);
    expect(mockCallback.mock.calls[0][0].children).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0].children[0]).toBe(
      mockCallback.mock.calls[1][0]
    );
    expect(mockCallback.mock.calls[1][0].parent).toBe(
      mockCallback.mock.calls[0][0]
    );

    container.close();
  });

  test("nested container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );

    const childContainer = container.createChildContainer();

    childContainer.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    const mockCallback = jest.fn(async (context, next) => {
      const before = context.response;
      await next();
      const after = context.response;

      expect(before).not.toEqual(after);
    });
    childContainer.use(mockCallback);

    await childContainer.resolve(Token.Vehicle);

    expect(mockCallback.mock.calls).toHaveLength(2);
    expect(mockCallback.mock.calls[0][0].children).toHaveLength(1);
    expect(mockCallback.mock.calls[0][0].children[0]).toBe(
      mockCallback.mock.calls[1][0]
    );
    expect(mockCallback.mock.calls[1][0].parent).toBe(
      mockCallback.mock.calls[0][0]
    );

    childContainer.close();
    container.close();
  });
});

describe("emitAsync", () => {
  test("only one container", async () => {
    const container = new RootContainer();

    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new RoundWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );
    container.bind(
      Token.Wheels,
      inContainerScope(() => new SquareWheel(), { array: true })
    );

    container.bind(
      Token.Vehicle,
      inContainerScope<Vehicle>(
        async (resolver) => new Bus(await resolver.resolve(Token.Wheels))
      )
    );

    container.on("create:async", async (value, done) => {
      done();
    });

    await container.resolve(Token.Vehicle);

    container.close();
  });
});

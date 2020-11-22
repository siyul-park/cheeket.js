import { Container, EventType, inRequestScope, interfaces } from "../../lib";

import Types from "../mock/types";
import Katana from "../mock/katana";
import Shuriken from "../mock/shuriken";
import Ninja from "../mock/ninja";
import Weapon from "../mock/weapon";
import ThrowableWeapon from "../mock/throwable-weapon";
import Warrior from "../mock/warrior";

const katanaProvider = () => new Katana();

const shurikenProvider = () => new Shuriken();

const ninjaProvider = async (context: interfaces.Context) => {
  return new Ninja(
    await context.resolve<Weapon>(Types.Weapon),
    await context.resolve<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

test("default", async () => {
  const container = new Container();

  container.bind(Types.Weapon, inRequestScope(katanaProvider));
  container.bind(Types.ThrowableWeapon, inRequestScope(shurikenProvider));
  container.bind(Types.Warrior, inRequestScope(ninjaProvider));

  const warrior = await container.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("resolve all", async () => {
  const container = new Container();

  container.bind(Types.Weapon, inRequestScope(katanaProvider));
  container.bind(Types.ThrowableWeapon, inRequestScope(shurikenProvider));

  container.bind(Types.Warrior, inRequestScope(ninjaProvider));
  container.bind(Types.Warrior, inRequestScope(ninjaProvider));

  const warriors = await container.resolveAll<Warrior>(Types.Warrior);

  expect(warriors.length).toEqual(2);
});

test("resolve event", async () => {
  const container = new Container();

  const contexts: interfaces.Context[] = [];
  const listener: interfaces.ResolveEventListener = (
    context: interfaces.Context
  ) => {
    contexts.push(context);
  };

  container.addListener(EventType.Resolve, listener);

  container.bind(Types.Weapon, inRequestScope(katanaProvider));
  container.bind(Types.ThrowableWeapon, inRequestScope(shurikenProvider));
  container.bind(Types.Warrior, inRequestScope(ninjaProvider));

  await container.resolve<Warrior>(Types.Warrior);

  expect(contexts.length).toEqual(3);

  expect(contexts[0].parent?.id).toEqual(contexts[2].id);
  expect(contexts[1].parent?.id).toEqual(contexts[2].id);

  expect(contexts[2].children.size).toEqual(2);
  expect(contexts[2].children.has(contexts[0])).toBeTruthy();
  expect(contexts[2].children.has(contexts[1])).toBeTruthy();

  expect(contexts[0].request.token).toEqual(Types.Weapon);
  expect(contexts[1].request.token).toEqual(Types.ThrowableWeapon);
  expect(contexts[2].request.token).toEqual(Types.Warrior);

  expect(contexts[0].request.resolved).not.toBeUndefined();
  expect(contexts[1].request.resolved).not.toBeUndefined();
  expect(contexts[2].request.resolved).not.toBeUndefined();
});

test("createChildContainer", async () => {
  const container = new Container();

  container.bind(Types.Weapon, inRequestScope(katanaProvider));
  container.bind(Types.ThrowableWeapon, inRequestScope(shurikenProvider));

  const childContainer = container.createChildContainer();

  childContainer.bind(Types.Warrior, inRequestScope(ninjaProvider));

  const warrior = await childContainer.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

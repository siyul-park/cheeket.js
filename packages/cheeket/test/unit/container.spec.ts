import Container from "../../lib/container/container";
import Types from "../mock/types";
import Katana from "../mock/katana";
import Shuriken from "../mock/shuriken";
import Ninja from "../mock/ninja";
import Weapon from "../mock/weapon";
import ThrowableWeapon from "../mock/throwable-weapon";
import Warrior from "../mock/warrior";
import LookUp from "../../lib/look-up/look-up";
import asSingleton from "../../lib/provider/as-singleton";

const katanaProvider = () => new Katana();

const shurikenProvider = () => new Shuriken();

const ninjaProvider = async (lookUp: LookUp) => {
  return new Ninja(
    await lookUp.getOrThrow<Weapon>(Types.Weapon),
    await lookUp.getOrThrow<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

test("default", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(asSingleton(katanaProvider));
  container.bind(Types.ThrowableWeapon).to(asSingleton(shurikenProvider));
  container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

  const warrior = await container.getOrThrow<Warrior>(Types.Warrior);
  const throwableWeapon = await container.getOrThrow<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.getOrThrow<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("access limiter", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(katanaProvider).inPrivate();
  container.bind(Types.ThrowableWeapon).to(shurikenProvider).inPrivate();
  container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

  expect(await container.get<Warrior>(Types.Warrior)).not.toBeUndefined();
  expect(
    await container.get<ThrowableWeapon>(Types.ThrowableWeapon)
  ).toBeUndefined();
  expect(await container.get<Weapon>(Types.Weapon)).toBeUndefined();
});

test("life cycle", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(katanaProvider);
  container.bind(Types.ThrowableWeapon).to(shurikenProvider);
  container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

  const warrior1 = await container.getOrThrow<Warrior>(Types.Warrior);
  const warrior2 = await container.getOrThrow<Warrior>(Types.Warrior);
  expect(warrior1).toBe(warrior2);

  const throwableWeapon1 = await container.getOrThrow<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const throwableWeapon2 = await container.getOrThrow<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  expect(throwableWeapon1).not.toBe(throwableWeapon2);

  const weapon1 = await container.getOrThrow<Weapon>(Types.Weapon);
  const weapon3 = await container.getOrThrow<Weapon>(Types.Weapon);
  expect(weapon1).not.toBe(weapon3);
});

test("sub container public", async () => {
  const container = new Container();
  container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

  const weaponContainer = new Container();
  weaponContainer.bind(Types.Weapon).to(katanaProvider);
  weaponContainer.bind(Types.ThrowableWeapon).to(asSingleton(shurikenProvider));

  container.imports(weaponContainer);

  const warrior = await container.getOrThrow<Warrior>(Types.Warrior);
  const throwableWeapon = await weaponContainer.getOrThrow<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await weaponContainer.getOrThrow<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("sub container private", async () => {
  const container = new Container();
  container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

  const weaponContainer = new Container();
  weaponContainer.bind(Types.Weapon).to(katanaProvider).inPrivate();
  weaponContainer.bind(Types.ThrowableWeapon).to(shurikenProvider).inPrivate();

  container.imports(weaponContainer);

  const warrior = await container.get<Warrior>(Types.Warrior);
  expect(warrior).toBeUndefined();
});

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
    await lookUp.resolve<Weapon>(Types.Weapon),
    await lookUp.resolve<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

test("default", async () => {
  const container = new Container();

  container.bind(Types.Weapon, asSingleton(katanaProvider));
  container.bind(Types.ThrowableWeapon, asSingleton(shurikenProvider));
  container.bind(Types.Warrior, asSingleton(ninjaProvider));

  const warrior = await container.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("export", async () => {
  const container = new Container();

  container.bind(Types.Weapon, asSingleton(katanaProvider));
  container.bind(Types.ThrowableWeapon, asSingleton(shurikenProvider));
  container.bind(Types.Warrior, asSingleton(ninjaProvider));

  const exported = container.export(Types.Warrior);

  expect(await exported.get<Warrior>(Types.Warrior)).not.toBeUndefined();
  expect(
    await exported.get<ThrowableWeapon>(Types.ThrowableWeapon)
  ).toBeUndefined();
  expect(await exported.get<Weapon>(Types.Weapon)).toBeUndefined();
});

test("import", async () => {
  const container = new Container();

  container.bind(Types.Weapon, asSingleton(katanaProvider));
  container.bind(Types.ThrowableWeapon, asSingleton(shurikenProvider));
  container.bind(Types.Warrior, asSingleton(ninjaProvider));

  const exported = container.export(Types.Warrior);

  const imported = new Container();
  imported.import(exported);

  expect(await imported.get<Warrior>(Types.Warrior)).not.toBeUndefined();
  expect(
    await imported.get<ThrowableWeapon>(Types.ThrowableWeapon)
  ).toBeUndefined();
  expect(await imported.get<Weapon>(Types.Weapon)).toBeUndefined();
});

test("life cycle", async () => {
  const container = new Container();

  container.bind(Types.Weapon, katanaProvider);
  container.bind(Types.ThrowableWeapon, shurikenProvider);
  container.bind(Types.Warrior, asSingleton(ninjaProvider));

  const warrior1 = await container.resolve<Warrior>(Types.Warrior);
  const warrior2 = await container.resolve<Warrior>(Types.Warrior);
  expect(warrior1).toBe(warrior2);

  const throwableWeapon1 = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const throwableWeapon2 = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  expect(throwableWeapon1).not.toBe(throwableWeapon2);

  const weapon1 = await container.resolve<Weapon>(Types.Weapon);
  const weapon3 = await container.resolve<Weapon>(Types.Weapon);
  expect(weapon1).not.toBe(weapon3);
});

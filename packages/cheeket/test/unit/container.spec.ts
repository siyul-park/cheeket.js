import Container from "../../lib/container/container";
import Types from "../mock/types";
import Katana from "../mock/katana";
import Shuriken from "../mock/shuriken";
import Ninja from "../mock/ninja";
import Weapon from "../mock/weapon";
import ThrowableWeapon from "../mock/throwable-weapon";
import Warrior from "../mock/warrior";
import interfaces from "../../lib/interfaces/interfaces";
import asSingleton from "../../lib/provider/asSingleton";

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

  container.bind(Types.Weapon, katanaProvider);
  container.bind(Types.ThrowableWeapon, shurikenProvider);
  container.bind(Types.Warrior, ninjaProvider);

  const warrior = await container.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("module", async () => {
  const container = new Container();
  container.bind(Types.Warrior, ninjaProvider);

  const weaponContainer = new Container();
  weaponContainer.bind(Types.ThrowableWeapon, shurikenProvider);
  weaponContainer.bind(Types.Weapon, katanaProvider);

  const module = weaponContainer.export([Types.ThrowableWeapon, Types.Weapon]);
  container.import(module);

  const warrior = await container.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("2-depth module", async () => {
  const container = new Container();
  container.bind(Types.Warrior, ninjaProvider);

  const throwableWeaponContainer = new Container();
  throwableWeaponContainer.bind(Types.ThrowableWeapon, shurikenProvider);

  const weaponContainer = new Container();
  weaponContainer.bind(Types.Weapon, katanaProvider);

  const throwableWeaponModule = throwableWeaponContainer.export([
    Types.ThrowableWeapon,
  ]);
  weaponContainer.import(throwableWeaponModule);

  const weaponModule = weaponContainer.export([Types.Weapon]);
  container.import(weaponModule);

  const warrior = await container.resolve<Warrior>(Types.Warrior);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.resolve<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("singleton", async () => {
  const container = new Container();

  container.bind(Types.Weapon, asSingleton(katanaProvider));
  container.bind(Types.ThrowableWeapon, asSingleton(shurikenProvider));
  container.bind(Types.Warrior, asSingleton(ninjaProvider));

  const warrior1 = await container.resolve<Warrior>(Types.Warrior);
  const warrior2 = await container.resolve<Warrior>(Types.Warrior);

  expect(warrior1).toBe(warrior2);
});

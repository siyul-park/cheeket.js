import Container from "../../lib/implement/container";
import Types from "../mock/types";
import Katana from "../mock/katana";
import Shuriken from "../mock/shuriken";
import Ninja from "../mock/ninja";
import Weapon from "../mock/weapon";
import ThrowableWeapon from "../mock/throwable-weapon";
import Warrior from "../mock/warrior";
import LookUp from "../../lib/interface/look-up";

const katanaProvider = () => new Katana();

const shurikenProvider = () => new Shuriken();

const ninjaProvider = async (lookUp: LookUp) => {
  return new Ninja(
    await lookUp.fetch<Weapon>(Types.Weapon),
    await lookUp.fetch<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

test("default", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(katanaProvider);
  container.bind(Types.ThrowableWeapon).to(shurikenProvider);
  container.bind(Types.Warrior).to(ninjaProvider);

  const warrior = await container.fetch<Warrior>(Types.Warrior);
  const throwableWeapon = await container.fetch<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await container.fetch<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("access limiter", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(katanaProvider).asPrivate();
  container.bind(Types.ThrowableWeapon).to(shurikenProvider).asPrivate();
  container.bind(Types.Warrior).to(ninjaProvider);

  expect(await container.get<Warrior>(Types.Warrior)).not.toBeUndefined();
  expect(
    await container.get<ThrowableWeapon>(Types.ThrowableWeapon)
  ).toBeUndefined();
  expect(await container.get<Weapon>(Types.Weapon)).toBeUndefined();
});

test("life cycle", async () => {
  const container = new Container();

  container.bind(Types.Weapon).to(katanaProvider).inRequest();
  container.bind(Types.ThrowableWeapon).to(shurikenProvider).inRequest();
  container.bind(Types.Warrior).to(ninjaProvider);

  const warrior1 = await container.fetch<Warrior>(Types.Warrior);
  const warrior2 = await container.fetch<Warrior>(Types.Warrior);
  expect(warrior1).toBe(warrior2);

  const throwableWeapon1 = await container.fetch<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const throwableWeapon2 = await container.fetch<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  expect(throwableWeapon1).not.toBe(throwableWeapon2);

  const weapon1 = await container.fetch<Weapon>(Types.Weapon);
  const weapon3 = await container.fetch<Weapon>(Types.Weapon);
  expect(weapon1).not.toBe(weapon3);
});

test("sub container public", async () => {
  const container = new Container();
  container.bind(Types.Warrior).to(ninjaProvider);

  const weaponContainer = new Container();
  weaponContainer.bind(Types.Weapon).to(katanaProvider);
  weaponContainer.bind(Types.ThrowableWeapon).to(shurikenProvider);

  container.imports(weaponContainer);

  const warrior = await container.fetch<Warrior>(Types.Warrior);
  const throwableWeapon = await weaponContainer.fetch<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const weapon = await weaponContainer.fetch<Weapon>(Types.Weapon);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

test("sub container private", async () => {
  const container = new Container();
  container.bind(Types.Warrior).to(ninjaProvider);

  const weaponContainer = new Container();
  weaponContainer.bind(Types.Weapon).to(katanaProvider).asPrivate();
  weaponContainer.bind(Types.ThrowableWeapon).to(shurikenProvider).asPrivate();

  container.imports(weaponContainer);

  const warrior = await container.get<Warrior>(Types.Warrior);
  expect(warrior).toBeUndefined();
});

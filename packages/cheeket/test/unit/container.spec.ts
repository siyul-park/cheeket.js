import { Container, interfaces } from "../../lib";

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

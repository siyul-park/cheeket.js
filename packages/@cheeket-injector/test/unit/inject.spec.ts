import "reflect-metadata";

import { asSingleton, Container } from "cheeket";
import Types from "../mock/types";
import autoInjected from "../../lib/injector/auto-injected";
import Katana from "../mock/katana";
import Weapon from "../mock/weapon";
import Shuriken from "../mock/shuriken";
import Ninja from "../mock/ninja";
import ThrowableWeapon from "../mock/throwable-weapon";
import Warrior from "../mock/warrior";

test("default", async () => {
  const container = new Container();
  container.bind(Types.Weapon, asSingleton(autoInjected(Katana)));
  container.bind(Types.ThrowableWeapon, asSingleton(autoInjected(Shuriken)));
  container.bind(Types.Warrior, asSingleton(autoInjected(Ninja)));

  const weapon = await container.resolve<Weapon>(Types.Weapon);
  const throwableWeapon = await container.resolve<ThrowableWeapon>(
    Types.ThrowableWeapon
  );
  const warrior = await container.resolve<Warrior>(Types.Warrior);

  expect(warrior.fight()).toEqual(weapon.hit());
  expect(warrior.sneak()).toEqual(throwableWeapon.throw());
});

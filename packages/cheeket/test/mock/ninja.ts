import Weapon from "./weapon";
import Warrior from "./warrior";
import ThrowableWeapon from "./throwable-weapon";

class Ninja implements Warrior {
  public constructor(
    private katana: Weapon,
    private shuriken: ThrowableWeapon
  ) {}

  fight(): string {
    return this.katana.hit();
  }

  sneak(): string {
    return this.shuriken.throw();
  }
}

export default Ninja;

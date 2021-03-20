import Weapon from "./weapon";
import Warrior from "./warrior";
import ThrowableWeapon from "./throwable-weapon";
import injectable from "../../lib/decorator/injectable";
import inject from "../../lib/decorator/inject";
import Types from "./types";

@injectable()
class Ninja implements Warrior {
  public constructor(
    @inject(Types.Weapon) private katana: Weapon,
    @inject(Types.ThrowableWeapon) private shuriken: ThrowableWeapon
  ) {}

  fight(): string {
    return this.katana.hit();
  }

  sneak(): string {
    return this.shuriken.throw();
  }
}

export default Ninja;

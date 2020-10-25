import ThrowableWeapon from "./throwable-weapon";
import injectable from "../../lib/decorator/injectable";

@injectable()
class Shuriken implements ThrowableWeapon {
  // eslint-disable-next-line class-methods-use-this
  throw(): string {
    return "hit!";
  }
}

export default Shuriken;

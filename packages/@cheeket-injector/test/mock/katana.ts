import Weapon from "./weapon";
import injectable from "../../lib/decorator/injectable";

@injectable()
class Katana implements Weapon {
  // eslint-disable-next-line class-methods-use-this
  hit(): string {
    return "cut!";
  }
}

export default Katana;

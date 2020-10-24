import Weapon from "./weapon";

class Katana implements Weapon {
  // eslint-disable-next-line class-methods-use-this
  hit(): string {
    return "cut!";
  }
}

export default Katana;

import ThrowableWeapon from "./throwable-weapon";

class Shuriken implements ThrowableWeapon {
  // eslint-disable-next-line class-methods-use-this
  throw(): string {
    return "hit!";
  }
}

export default Shuriken;

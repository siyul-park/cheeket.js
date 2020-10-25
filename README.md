# Cheeket
A very lightweight dependency injection container for TypeScript/JavaScript for constructor injection as functional.
  
```typescript
interface Weapon {
  hit(): string;
}

class Katana implements Weapon {
  hit(): string {
    return "cut!";
  }
}

interface ThrowableWeapon {
  throw(): string;
}

class Shuriken implements ThrowableWeapon {
  throw(): string {
    return "hit!";
  }
}

interface Warrior {
  fight(): string;
  sneak(): string;
}

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

const katanaProvider = () => new Katana();

const shurikenProvider = () => new Shuriken();

const ninjaProvider = async (lookUp: LookUp) => {
  return new Ninja(
    await lookUp.resolveOrThrow<Weapon>(Types.Weapon),
    await lookUp.resolveOrThrow<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

const container = new Container();

container.bind(Types.Weapon).to(asSingleton(katanaProvider));
container.bind(Types.ThrowableWeapon).to(asSingleton(shurikenProvider));
container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

const warrior = await container.resolveOrThrow<Warrior>(Types.Warrior);
const throwableWeapon = await container.resolveOrThrow<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await container.resolveOrThrow<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```

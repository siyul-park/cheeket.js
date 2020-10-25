# cheeket.js
Simple DI Library  
  
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

const ninjaProvider = async (lookUp: LookUpInterface) => {
  return new Ninja(
    await lookUp.fetch<Weapon>(Types.Weapon),
    await lookUp.fetch<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

const container = new Container();

container.bind(Types.Weapon).to(katanaProvider);
container.bind(Types.ThrowableWeapon).to(asSingleton(shurikenProvider));
container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

const warrior = await container.fetch<Warrior>(Types.Warrior);
const throwableWeapon = await container.fetch<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await container.fetch<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```

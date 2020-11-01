# Cheeket
[![CodeFactor](https://www.codefactor.io/repository/github/siyual-park/cheeket.js/badge)](https://www.codefactor.io/repository/github/siyual-park/cheeket.js)
![](https://img.shields.io/npm/dm/cheeket.png?style=flat-square)

A lightweight and extensible dependency injection container for TypeScript/JavaScript for constructor injection as functional.
  
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

const ninjaProvider = async (lookUp: Finder) => {
  return new Ninja(
    await lookUp.resolve<Weapon>(Types.Weapon),
    await lookUp.resolve<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

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
```
  
## Plugins  
- [@cheeket/injector](https://www.npmjs.com/package/@cheeket/injector
): a decorator-based injector plugin  

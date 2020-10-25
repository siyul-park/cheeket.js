# Cheeket
[![CodeFactor](https://www.codefactor.io/repository/github/siyual-park/cheeket.js/badge)](https://www.codefactor.io/repository/github/siyual-park/cheeket.js)
![](https://img.shields.io/npm/dm/cheeket.png?style=flat-square)

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
container.bind(Types.Warrior).to(asSingleton(ninjaProvider));

const weaponContainer = new Container();
weaponContainer.bind(Types.Weapon).to(asSingleton(katanaProvider));
weaponContainer.bind(Types.ThrowableWeapon).to(asSingleton(shurikenProvider));

container.imports(weaponContainer);

const warrior = await container.resolveOrThrow<Warrior>(Types.Warrior);
const throwableWeapon = await weaponContainer.resolveOrThrow<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await weaponContainer.resolveOrThrow<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```


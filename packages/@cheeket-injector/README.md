# Cheeket Injector
![](https://img.shields.io/npm/dm/@cheeket/injector.png?style=flat-square)

a decorator-based injector plugin for of [cheeket](https://www.npmjs.com/package/cheeket)
  
```typescript
interface Weapon {
  hit(): string;
}

@injectable()
class Katana implements Weapon {
  hit(): string {
    return "cut!";
  }
}

interface ThrowableWeapon {
  throw(): string;
}

@injectable()
class Shuriken implements ThrowableWeapon {
  throw(): string {
    return "hit!";
  }
}

interface Warrior {
  fight(): string;
  sneak(): string;
}

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

const container = new Container();

container.bind(Types.Weapon, asSingleton(autoInjected(Katana)));
container.bind(Types.ThrowableWeapon, asSingleton(autoInjected(Shuriken)));
container.bind(Types.Warrior, asSingleton(autoInjected(Ninja)));

const warrior = await container.resolveOrThrow<Warrior>(Types.Warrior);
const throwableWeapon = await container.resolveOrThrow<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await container.resolveOrThrow<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```


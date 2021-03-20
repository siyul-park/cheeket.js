# Cheeket Injector
![](https://img.shields.io/npm/dm/@cheeket/injector.png?style=flat-square)

a decorator-based injector plugin for [cheeket](https://www.npmjs.com/package/cheeket)
  
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

container.bind(Types.Weapon, autoInjected(Katana));
container.bind(Types.ThrowableWeapon, autoInjected(Shuriken));
container.bind(Types.Warrior, autoInjected(Ninja));

const warrior = await container.resolve<Warrior>(Types.Warrior);
const throwableWeapon = await container.resolve<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await container.resolve<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```


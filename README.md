# pici.js
Simple DI Library  
  
```typescript
const katanaProvider = () => new Katana();

const shurikenProvider = () => new Shuriken();

const ninjaProvider = async (lookUp: LookUp) => {
  return new Ninja(
    await lookUp.fetch<Weapon>(Types.Weapon),
    await lookUp.fetch<ThrowableWeapon>(Types.ThrowableWeapon)
  );
};

const container = new Container();

container.bind(Types.Weapon).to(katanaProvider);
container.bind(Types.ThrowableWeapon).to(shurikenProvider);
container.bind(Types.Warrior).to(ninjaProvider);

const warrior = await container.fetch<Warrior>(Types.Warrior);
const throwableWeapon = await container.fetch<ThrowableWeapon>(
  Types.ThrowableWeapon
);
const weapon = await container.fetch<Weapon>(Types.Weapon);

expect(warrior.fight()).toEqual(weapon.hit());
expect(warrior.sneak()).toEqual(throwableWeapon.throw());
```

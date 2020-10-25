import Identifier from "../identifier/identifier";
import LookUp from "../look-up/look-up";
import BinderImpl from "../binding/binder-impl";
import Storage from "../storage/storage";
import Finder from "../look-up/finder";
import Provider from "../provider/provider";
import LookUpProjector from "../look-up/look-up-projector";
import Binder from "../binding/binder";

class Container implements Binder, LookUp {
  private readonly storage = new Storage();

  private readonly finder = new Finder(this.storage);

  private readonly binder = new BinderImpl(this.storage);

  bind<T>(id: Identifier<T>, provider: Provider<T>): void {
    this.binder.bind(id, provider);
  }

  unbind<T>(id: Identifier<T>): void {
    this.binder.unbind(id);
  }

  async resolve<T>(id: Identifier<T>): Promise<T> {
    return this.finder.resolve(id);
  }

  async get<T>(id: Identifier<T>): Promise<T | undefined> {
    return this.finder.get(id);
  }

  import<T>(...lookUps: LookUp[]): void {
    lookUps.forEach((lookUp) => this.finder.import(lookUp));
  }

  export(...ids: Identifier<unknown>[]): LookUp {
    return new LookUpProjector(this, new Set<Identifier<unknown>>(ids));
  }
}

export default Container;

import interfaces from "../interfaces/interfaces";

class Binding<T> implements interfaces.Binding<T> {
  constructor(
    public token: interfaces.Token<T>,
    public provider: interfaces.Provider<T>
  ) {}
}

export default Binding;

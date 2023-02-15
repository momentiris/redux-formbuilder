import "./App.css";
import { Counter } from "./features/counter/Counter";
import { FormBuilder } from "./features/form-builder/FormBuilder";

function App() {
  return (
    <div>
      <Counter />
      <FormBuilder />
    </div>
  );
}

export default App;

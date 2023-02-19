import { AddFormField } from "./AddFormField";
import "./FormBuilder.module.css";
import { Fields } from "./Fields";
import { FormResult } from "./FormResult";

export function FormBuilder() {
  return (
    <div>
      {/* <button onClick={() => dispatch(actions.addField("text"))}>add</button> */}
      <AddFormField />
      <div>
        <Fields />
      </div>
      <FormResult />
    </div>
  );
}

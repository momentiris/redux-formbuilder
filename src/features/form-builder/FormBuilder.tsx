import { AddFormField } from "./AddFormField";
import "./FormBuilder.module.css";
import { EditableFields } from "./Fields";
import { FormResult } from "./FormResult";

export function FormBuilder() {
  return (
    <div>
      <AddFormField />
      <div>
        <EditableFields />
      </div>
      <FormResult />
    </div>
  );
}

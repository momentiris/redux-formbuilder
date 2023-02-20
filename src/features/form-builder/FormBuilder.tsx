import { AddFormField } from "./AddFormField";
import "./FormBuilder.module.css";
import { EditableFields } from "./EditableFields";
import { FormResult } from "../form-result/FormResult";

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

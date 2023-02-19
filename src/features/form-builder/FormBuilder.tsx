import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { AddFormField } from "./AddFormField";
import { actions, formBuilderValue } from "./formBuilderSlice";
import "./FormBuilder.module.css";
import { Fields } from "./Fields";

export function FormBuilder() {
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();

  return (
    <div>
      {/* <button onClick={() => dispatch(actions.addField("text"))}>add</button> */}
      <AddFormField />

      <div>
        <Fields />
      </div>
    </div>
  );
}

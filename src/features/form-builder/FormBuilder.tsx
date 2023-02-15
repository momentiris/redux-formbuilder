import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { actions, formBuilderValue } from "./formBuilderSlice";

export function FormBuilder() {
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();

  console.log(state);
  return (
    <div>
      <button onClick={() => dispatch(actions.addField("text"))}>add</button>
      <div>
        {state.map((field) => (
          <div>
            <button
              key={field.id}
              onClick={() => dispatch(actions.removeField(field.id))}
            >
              {field.id}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

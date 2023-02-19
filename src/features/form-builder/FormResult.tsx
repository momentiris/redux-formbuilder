import { match } from "ts-pattern";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  TextField as TextFieldType,
  formBuilderValue,
} from "./formBuilderSlice";

export const FormResult = () => {
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();
  return (
    <form>
      {state.map((field) =>
        match(field)
          .with({ type: "text" }, () => <div />)
          .with({ type: "select" }, () => <div />)
          .with({ type: "checkbox" }, () => <div />)
          .exhaustive()
      )}
    </form>
  );
};

const TextField = ({ field }: { field: TextFieldType }) => (
  <label>
    {"label"}
    <input type="text" defaultValue={field.defaultValue} />
  </label>
);

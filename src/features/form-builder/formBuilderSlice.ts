import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { match } from "ts-pattern";

type TextField = { id: string; type: "text"; value: string | undefined };
type CheckboxField = { id: string; type: "checkbox"; value: boolean };
type SelectField = {
  id: string;
  type: "select";
  value: Option | undefined;
  options: Array<Option>;
};
type Option = { id: string; value: string };

type Field = TextField | CheckboxField | SelectField;

type RequiredValidation = {
  type: "required";
  required: boolean;
};

type ValidationRule = RequiredValidation;
type ValidationRules = { rules: Array<ValidationRule> };
type ValidationError = { type: ValidationRule["type"]; message: string };

type ValidationResult = {
  result:
    | { type: "negative" }
    | { type: "positive"; errors: Array<ValidationError> };
};

type WithValidation<T extends Field> = T & ValidationRules & ValidationResult;

type FormField = WithValidation<Field>;

export interface FormBuilderState {
  value: Array<FormField>;
}

const initialState: FormBuilderState = {
  value: [],
};

const createTextField = (): FormField => ({
  type: "text",
  value: "",
  rules: [],
  result: { type: "negative" },
  id: Math.random().toString(),
});

const createCheckboxField = (): FormField => ({
  type: "checkbox",
  value: false,
  rules: [],
  result: { type: "negative" },
  id: Math.random().toString(),
});

const createSelectField = (): FormField => ({
  type: "select",
  options: [],
  value: undefined,
  rules: [],
  result: { type: "negative" },
  id: Math.random().toString(),
});

const addField: CaseReducer<FormBuilderState, PayloadAction<Field["type"]>> = (
  state,
  action: PayloadAction<Field["type"]>
) => {
  const field = match(action.payload)
    .with("text", createTextField)
    .with("select", createSelectField)
    .with("checkbox", createCheckboxField)
    .exhaustive();

  return Object.assign({}, state, { value: state.value.concat(field) });
};

const removeField: CaseReducer<FormBuilderState, PayloadAction<Field["id"]>> = (
  state,
  action: PayloadAction<Field["id"]>
) =>
  Object.assign({}, state, {
    value: state.value.filter((field) => field.id !== action.payload),
  });

export const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    addField,
    removeField,
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const formBuilderValue = (state: RootState) => state.formBuilder.value;

export const actions = formBuilderSlice.actions;
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
// (amount: number): AppThunk =>
// (dispatch, getState) => {
// const currentValue = selectCount(getState());
// if (currentValue % 2 === 1) {
// dispatch(incrementByAmount(amount));
// }
// };

export default formBuilderSlice.reducer;

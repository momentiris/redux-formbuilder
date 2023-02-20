import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { match } from "ts-pattern";

export type TextField = {
  id: string;
  type: "text";
  defaultValue?: string;
  label?: string;
};

export type CheckboxField = {
  id: string;
  type: "checkbox";
  defaultValue: boolean;
  label?: string;
};

export type SelectField = {
  id: string;
  type: "select";
  options: Array<Option>;
  defaultValue?: Option;
  label?: string;
};

export type SelectFieldEditables = Pick<
  SelectField,
  "label" | "defaultValue" | "options"
>;

export type TextFieldEditables = Pick<TextField, "label" | "defaultValue">;

export type CheckboxFieldEditables = Pick<CheckboxField, "defaultValue">;

export type FieldEditables =
  | SelectFieldEditables
  | TextFieldEditables
  | CheckboxFieldEditables;

type Option = { id: string; value: string };

export type Field = TextField | CheckboxField | SelectField;

type RequiredValidation = {
  type: "required";
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

export type FormField = WithValidation<Field>;

export interface FormBuilderState {
  value: Array<FormField>;
}

const initialState: FormBuilderState = {
  value: [],
};

const createTextField = (): FormField => ({
  type: "text",
  label: undefined,
  defaultValue: "",
  rules: [],
  result: { type: "negative" },
  id: Math.random().toString(),
});

const createCheckboxField = (): FormField => ({
  type: "checkbox",
  label: undefined,
  defaultValue: false,
  rules: [],
  result: { type: "negative" },
  id: Math.random().toString(),
});

const createSelectField = (): FormField => ({
  type: "select",
  options: [],
  label: undefined,
  defaultValue: undefined,
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

const updateTextField: CaseReducer<
  FormBuilderState,
  PayloadAction<TextFieldEditables & { id: Field["id"] }>
> = (
  state,
  action: PayloadAction<TextFieldEditables & { id: Field["id"] }>
) => {
  const field = state.value.find(
    (x): x is Extract<FormField, { type: "text" }> =>
      x.id === action.payload.id && x.type === "text"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return { ...state, value: [updatedField] };
};

const updateCheckboxField: CaseReducer<
  FormBuilderState,
  PayloadAction<CheckboxFieldEditables & { id: Field["id"] }>
> = (
  state,
  action: PayloadAction<CheckboxFieldEditables & { id: Field["id"] }>
) => {
  const field = state.value.find(
    (x): x is Extract<FormField, { type: "checkbox" }> =>
      x.id === action.payload.id && x.type === "checkbox"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return { ...state, value: [updatedField] };
};

const updateSelectField: CaseReducer<
  FormBuilderState,
  PayloadAction<SelectFieldEditables & { id: Field["id"] }>
> = (
  state,
  action: PayloadAction<SelectFieldEditables & { id: Field["id"] }>
) => {
  const field = state.value.find(
    (x): x is Extract<FormField, { type: "select" }> =>
      x.id === action.payload.id && x.type === "select"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return { ...state, value: [updatedField] };
};

const addValidationRule: CaseReducer<
  FormBuilderState,
  PayloadAction<ValidationRule & { fieldId: Field["id"] }>
> = (
  state,
  action: PayloadAction<ValidationRule & { fieldId: Field["id"] }>
) => {
  const field = state.value.find((x) => x.id === action.payload.fieldId);

  if (!field) return state;

  const updatedField: FormField = {
    ...field,
    rules: field.rules.concat({ type: action.payload.type }),
  };

  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const removeValidationRule: CaseReducer<
  FormBuilderState,
  PayloadAction<ValidationRule & { fieldId: Field["id"] }>
> = (
  state,
  action: PayloadAction<ValidationRule & { fieldId: Field["id"] }>
) => {
  const field = state.value.find((x) => x.id === action.payload.fieldId);

  if (!field) return state;

  const updatedField: FormField = {
    ...field,
    rules: field.rules.filter((rule) => rule.type !== action.payload.type),
  };

  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

export const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    addField,
    removeField,
    updateTextField,
    updateSelectField,
    updateCheckboxField,
    addValidationRule,
    removeValidationRule,
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

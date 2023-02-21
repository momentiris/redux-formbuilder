import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { match } from "ts-pattern";
import {
  createCheckboxField,
  createSelectField,
  createTextField,
  id,
} from "./utils";

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

export type CheckboxFieldEditables = Pick<
  CheckboxField,
  "defaultValue" | "label"
>;

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

export type TextFormField = Extract<FormField, { type: "text" }>;
export type SelectFormField = Extract<FormField, { type: "select" }>;
export type CheckboxFormField = Extract<FormField, { type: "checkbox" }>;

export interface FormBuilderState {
  value: Array<FormField>;
}

const initialState: FormBuilderState = {
  value: [],
};

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
> = (state, action) => {
  const field = state.value.find(
    (x): x is TextFormField => x.id === action.payload.id && x.type === "text"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const updateCheckboxField: CaseReducer<
  FormBuilderState,
  PayloadAction<Partial<CheckboxFieldEditables> & { id: Field["id"] }>
> = (state, action) => {
  const field = state.value.find(
    (x): x is CheckboxFormField =>
      x.id === action.payload.id && x.type === "checkbox"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const updateSelectField: CaseReducer<
  FormBuilderState,
  PayloadAction<Partial<SelectFieldEditables> & { id: Field["id"] }>
> = (state, action) => {
  const field = state.value.find(
    (x): x is SelectFormField =>
      x.id === action.payload.id && x.type === "select"
  );

  if (!field) return state;

  const updatedField = Object.assign({}, field, action.payload);
  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const addSelectOption: CaseReducer<
  FormBuilderState,
  PayloadAction<{ id: Field["id"]; value: string }>
> = (state, action) => {
  const field = state.value.find(
    (x): x is SelectFormField =>
      x.id === action.payload.id && x.type === "select"
  );

  if (!field) return state;

  const updatedField: typeof field = {
    ...field,
    options: field.options.concat({ id: id(), value: action.payload.value }),
  };

  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const removeSelectOption: CaseReducer<
  FormBuilderState,
  PayloadAction<{ id: Field["id"]; option: Option }>
> = (state, action) => {
  const field = state.value.find(
    (x): x is SelectFormField =>
      x.id === action.payload.id && x.type === "select"
  );

  if (!field) return state;

  const updatedField: typeof field = {
    ...field,
    options: field.options.filter((o) => o.id !== action.payload.option.id),
  };

  return {
    ...state,
    value: state.value.map((f) =>
      f.id === updatedField.id ? updatedField : f
    ),
  };
};

const addValidationRule: CaseReducer<
  FormBuilderState,
  PayloadAction<ValidationRule & { fieldId: Field["id"] }>
> = (state, action) => {
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
> = (state, action) => {
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
    addSelectOption,
    removeSelectOption,
  },
});

export const formBuilderValue = (state: RootState) => state.formBuilder.value;
export const actions = formBuilderSlice.actions;
export default formBuilderSlice.reducer;

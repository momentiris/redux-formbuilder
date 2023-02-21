import { FormField } from "./formBuilderSlice";

export const createTextField = (): FormField => ({
  type: "text",
  label: undefined,
  defaultValue: "",
  rules: [],
  result: { type: "negative" },
  id: id(),
});

export const createCheckboxField = (): FormField => ({
  type: "checkbox",
  label: undefined,
  defaultValue: false,
  rules: [],
  result: { type: "negative" },
  id: id(),
});

export const createSelectField = (): FormField => ({
  type: "select",
  options: [],
  label: undefined,
  defaultValue: undefined,
  rules: [],
  result: { type: "negative" },
  id: id(),
});

export const id = () => Math.random().toString();

import { match } from "ts-pattern";
import { useAppSelector } from "../../app/hooks";
import { FormField, formBuilderValue } from "./formBuilderSlice";
import styles from "./FormResult.module.css";

export const FormResult = () => {
  const state = useAppSelector(formBuilderValue);
  const onFormSubmit = (fn: any) => {
    fn();
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) =>
        e.preventDefault()! || onFormSubmit(() => console.log("submitted"))
      }
    >
      <h3>Result</h3>
      {state.map((field) =>
        match(field)
          .with({ type: "text" }, (field) => (
            <TextField key={field.id} field={field} />
          ))
          .with({ type: "select" }, (field) => (
            <SelectField key={field.id} field={field} />
          ))
          .with({ type: "checkbox" }, (field) => (
            <CheckboxField key={field.id} field={field} />
          ))
          .exhaustive()
      )}
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

const TextField = ({
  field,
}: {
  field: Extract<FormField, { type: "text" }>;
}) => (
  <label>
    {field.label}
    <input
      className={styles.formField}
      type="text"
      defaultValue={field.defaultValue}
    />
  </label>
);

const SelectField = ({
  field,
}: {
  field: Extract<FormField, { type: "select" }>;
}) => (
  <label>
    {field.label}
    <select
      className={styles.formField}
      defaultValue={field.defaultValue?.value}
    >
      {field.options.map((option) => (
        <option key={option.id}>{option.value}</option>
      ))}
    </select>
  </label>
);

const CheckboxField = ({
  field,
}: {
  field: Extract<FormField, { type: "checkbox" }>;
}) => (
  <label>
    {field.label}
    <input
      type="checkbox"
      className={styles.formField}
      defaultChecked={field.defaultValue}
    />
  </label>
);

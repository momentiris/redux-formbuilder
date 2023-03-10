import { match } from "ts-pattern";
import { useAppSelector } from "../../app/hooks";
import { formBuilderValue, FormField } from "../form-builder/formBuilderSlice";
import styles from "./FormResult.module.css";

export const FormResult = () => {
  const state = useAppSelector(formBuilderValue);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements;
    console.log(elements);
  };

  return (
    <form className={styles.form} onSubmit={onFormSubmit}>
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
}) => {
  const required = field.rules.some((rule) => rule.type === "required");

  return (
    <label>
      <div>
        <strong>
          <small>{field.label} </small>
        </strong>
      </div>
      <input
        name="adde"
        id="adde"
        required={required}
        className={styles.formField}
        type="text"
        defaultValue={field.defaultValue}
      />
    </label>
  );
};

const SelectField = ({
  field,
}: {
  field: Extract<FormField, { type: "select" }>;
}) => {
  const required = field.rules.some((rule) => rule.type === "required");
  return (
    <label>
      <div>
        <strong>
          <small>{field.label} </small>
        </strong>
      </div>
      <select
        required={required}
        className={styles.formField}
        defaultValue={field.defaultValue?.value}
      >
        {field.options.map((option) => (
          <option key={option.id}>{option.value}</option>
        ))}
      </select>
    </label>
  );
};

const CheckboxField = ({
  field,
}: {
  field: Extract<FormField, { type: "checkbox" }>;
}) => {
  const required = field.rules.some((rule) => rule.type === "required");
  return (
    <label>
      <div>
        <strong>
          <small>{field.label}</small>
        </strong>
      </div>

      <input
        type="checkbox"
        className={styles.formField}
        defaultChecked={field.defaultValue}
        required={required}
      />
    </label>
  );
};

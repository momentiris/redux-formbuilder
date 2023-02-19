import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actions,
  formBuilderValue,
  Field as FieldType,
} from "./formBuilderSlice";
import styles from "./Fields.module.css";
import { useState } from "react";
import { match } from "ts-pattern";

export const Fields = () => {
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState<string>();

  const onEdit = (fieldId: string) => {
    if (expanded === fieldId) {
      return setExpanded(undefined);
    }

    setExpanded(fieldId);
    // dispatch(actions.removeField(fieldId));
  };

  return (
    <div className={styles.fields}>
      {state.map((field) => (
        <Field
          onEdit={() => onEdit(field.id)}
          onRemove={() => dispatch(actions.removeField(field.id))}
          name={field.type}
          key={field.id}
          mode={expanded === field.id ? "expanded" : "collapsed"}
          type={field.type}
        />
      ))}
    </div>
  );
};

type FieldProps = {
  onEdit: () => void;
  name: string;
  onRemove: () => void;
  mode: "collapsed" | "expanded";
  type: FieldType["type"];
};

const Field = ({ onEdit, name, onRemove, mode, type }: FieldProps) => {
  return (
    <div className={styles.field} onClick={onEdit}>
      <div className={styles.fieldRow}>
        <div>{name}</div>
        <div>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onRemove}>Remove</button>
        </div>
      </div>
      {mode === "expanded" && (
        <div>
          {match(type)
            .with("text", () => <TextFieldDetails />)
            .with("select", () => <SelectFieldDetails />)
            .with("checkbox", () => <CheckboxFieldDetails />)
            .exhaustive()}
        </div>
      )}
    </div>
  );
};

const TextFieldDetails = () => {
  return (
    <form>
      <label>
        <span>Label</span>
        <input />
      </label>
      <label>
        <span>Default value</span>
        <input />
      </label>
      <label>
        <span>Required</span>
        <input type="radio" />
      </label>
    </form>
  );
};

const SelectFieldDetails = () => {
  return (
    <form>
      <label>
        <span>Label</span>
        <input />
      </label>
      <label>
        <span>Default value</span>
        <input />
      </label>
      <label>
        <span>Required</span>
        <input type="radio" />
      </label>
    </form>
  );
};

const CheckboxFieldDetails = () => {
  return (
    <form>
      <label>
        <span>Label</span>
        <input />
      </label>
      <label>
        <span>Default value</span>
        <input />
      </label>
      <label>
        <span>Required</span>
        <input type="radio" />
      </label>
    </form>
  );
};

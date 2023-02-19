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
  return match(type)
    .with("text", () => (
      <EditableTextField
        type={type}
        mode={mode}
        onRemove={onRemove}
        name={name}
        onEdit={onEdit}
      />
    ))
    .with("select", () => (
      <EditableSelectField
        type={type}
        mode={mode}
        onRemove={onRemove}
        name={name}
        onEdit={onEdit}
      />
    ))
    .with("checkbox", () => (
      <EditableCheckboxField
        type={type}
        mode={mode}
        onRemove={onRemove}
        name={name}
        onEdit={onEdit}
      />
    ))
    .exhaustive();
};

const EditableTextField = ({ onEdit, name, onRemove, mode }: FieldProps) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>{name}</div>
        <div>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onRemove}>Remove</button>
        </div>
      </div>
      {mode === "expanded" && (
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
      )}
    </div>
  );
};

const EditableSelectField = ({ onEdit, name, onRemove, mode }: FieldProps) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>{name}</div>
        <div>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onRemove}>Remove</button>
        </div>
      </div>
      {mode === "expanded" && (
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
      )}
    </div>
  );
};

const EditableCheckboxField = ({
  onEdit,
  name,
  onRemove,
  mode,
}: FieldProps) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>{name}</div>
        <div>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onRemove}>Remove</button>
        </div>
      </div>
      {mode === "expanded" && (
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
      )}
    </div>
  );
};

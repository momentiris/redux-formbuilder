import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actions,
  formBuilderValue,
  Field as FieldType,
  FormField,
  TextField,
  SelectField,
  CheckboxField,
} from "./formBuilderSlice";
import styles from "./Fields.module.css";
import { useState } from "react";
import { match } from "ts-pattern";

export const EditableFields = () => {
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
      {state.map((field) => {
        const mode = expanded === field.id ? "expanded" : "collapsed";

        return (
          <EditableField
            key={field.id}
            mode={mode}
            onEdit={() => onEdit(field.id)}
            onRemove={() => dispatch(actions.removeField(field.id))}
            field={field}
          />
        );
      })}
    </div>
  );
};

type FieldProps = {
  onEdit: () => void;
  onRemove: () => void;
  mode: "collapsed" | "expanded";
  field: FormField;
};

const EditableField = (props: FieldProps) => {
  return match(props.field)
    .with({ type: "text" }, (field) => (
      <EditableTextField
        field={field}
        mode={props.mode}
        onRemove={props.onRemove}
        onEdit={props.onEdit}
      />
    ))
    .with({ type: "select" }, (field) => (
      <EditableSelectField
        field={field}
        mode={props.mode}
        onRemove={props.onRemove}
        onEdit={props.onEdit}
      />
    ))
    .with({ type: "checkbox" }, (field) => (
      <EditableCheckboxField
        field={field}
        mode={props.mode}
        onRemove={props.onRemove}
        onEdit={props.onEdit}
      />
    ))
    .exhaustive();
};

const EditableTextField = (
  props: FieldProps & {
    field: Extract<FormField, { type: "text" }>;
  }
) => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>Text</div>
        <div>
          <button onClick={props.onEdit}>Edit</button>
          <button onClick={props.onRemove}>Remove</button>
        </div>
      </div>
      {props.mode === "expanded" && (
        <form>
          <label>
            <span>Label</span>
            <input
              onChange={(e) =>
                dispatch(
                  actions.updateTextField({
                    id: props.field.id,
                    label: e.currentTarget.value,
                  })
                )
              }
            />
          </label>
          <label>
            <span>Default value</span>
            <input />
          </label>
          <label>
            <span>Required</span>
            <input
              type="checkbox"
              onChange={() =>
                dispatch(
                  actions.addValidationRule({
                    fieldId: props.field.id,
                    type: "required",
                  })
                )
              }
            />
          </label>
        </form>
      )}
    </div>
  );
};

const EditableSelectField = (
  props: FieldProps & {
    field: Extract<FormField, { type: "select" }>;
  }
) => {
  const state = useAppSelector(formBuilderValue);
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>Select</div>
        <div>
          <button onClick={props.onEdit}>Edit</button>
          <button onClick={props.onRemove}>Remove</button>
        </div>
      </div>
      {props.mode === "expanded" && (
        <form>
          <label>
            <div>Label</div>
            <input />
          </label>
          <label>
            <div>Default value</div>
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

const EditableCheckboxField = (
  props: FieldProps & {
    field: Extract<FormField, { type: "checkbox" }>;
  }
) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldRow}>
        <div>Checkbox</div>
        <div>
          <button onClick={props.onEdit}>Edit</button>
          <button onClick={props.onRemove}>Remove</button>
        </div>
      </div>
      {props.mode === "expanded" && (
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

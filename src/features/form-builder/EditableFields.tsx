import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actions,
  CheckboxField,
  formBuilderValue,
  FormField,
  SelectFormField,
  TextFormField,
} from "./formBuilderSlice";
import styles from "./EditableFields.module.css";
import { useState } from "react";
import { match } from "ts-pattern";

export const EditableFields = () => {
  const [expanded, setExpanded] = useState<string>();
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();

  const onEdit = (fieldId: string) =>
    setExpanded(expanded === fieldId ? undefined : fieldId);

  return (
    <div className={styles.fields}>
      {state.map((field) => {
        const mode = expanded === field.id ? "expanded" : "collapsed";

        return match(field)
          .with({ type: "text" }, (field) => (
            <EditableTextField
              field={field}
              mode={mode}
              onRemove={() => dispatch(actions.removeField(field.id))}
              onEdit={() => onEdit(field.id)}
            />
          ))
          .with({ type: "select" }, (field) => (
            <EditableSelectField
              field={field}
              mode={mode}
              onEdit={() => onEdit(field.id)}
              onRemove={() => dispatch(actions.removeField(field.id))}
            />
          ))
          .with({ type: "checkbox" }, (field) => (
            <EditableCheckboxField
              field={field}
              mode={mode}
              onEdit={() => onEdit(field.id)}
              onRemove={() => dispatch(actions.removeField(field.id))}
            />
          ))
          .exhaustive();
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

const TextField = ({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value?: string;
}) => (
  <label>
    <span>{label}</span>
    {value === undefined ? (
      <input onChange={(e) => onChange(e.currentTarget.value)} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.currentTarget.value)} />
    )}
  </label>
);

const EditableTextField = (
  props: FieldProps & {
    field: TextFormField;
  }
) => {
  const dispatch = useAppDispatch();
  const isRequired = props.field.rules.some((x) => x.type === "required");
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
          <TextField
            value={props.field.label}
            label="Label"
            onChange={(v) =>
              dispatch(
                actions.updateTextField({
                  id: props.field.id,
                  label: v,
                })
              )
            }
          />
          <TextField
            label="Default value"
            onChange={(v) =>
              dispatch(
                actions.updateTextField({
                  id: props.field.id,
                  defaultValue: v,
                })
              )
            }
          />
          <label>
            <span>Required</span>
            <input
              type="checkbox"
              onChange={() =>
                dispatch(
                  isRequired
                    ? actions.removeValidationRule({
                        fieldId: props.field.id,
                        type: "required",
                      })
                    : actions.addValidationRule({
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
    field: SelectFormField;
  }
) => {
  const [option, setOption] = useState("");
  const dispatch = useAppDispatch();

  const onAddOption = (value: string) => {
    dispatch(
      actions.addSelectOption({
        id: props.field.id,
        value,
      })
    );

    setOption("");
  };

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
          <TextField
            label="Label"
            onChange={(v) =>
              dispatch(
                actions.updateSelectField({
                  id: props.field.id,
                  label: v,
                })
              )
            }
          />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <TextField
              value={option}
              label="Options"
              onChange={(v) => setOption(v)}
            />
            <button
              type="button"
              disabled={!Boolean(option)}
              onClick={() => onAddOption(option)}
            >
              Add
            </button>
          </div>
          <div>
            {props.field.options.map((option) => (
              <div key={option.id}>{option.value}</div>
            ))}
          </div>
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

const EditableCheckboxField = (
  props: FieldProps & {
    field: CheckboxField;
  }
) => {
  const dispatch = useAppDispatch();
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
          <TextField
            label="Label"
            onChange={(v) =>
              dispatch(
                actions.updateCheckboxField({
                  id: props.field.id,
                  label: v,
                })
              )
            }
          />
          <label>
            <span>Default value</span>
            <input
              type="checkbox"
              onChange={(e) =>
                dispatch(
                  actions.updateCheckboxField({
                    id: props.field.id,
                    defaultValue: e.currentTarget.checked,
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

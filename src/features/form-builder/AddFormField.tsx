import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  actions,
  Field,
  formBuilderValue,
  TextField,
} from "./formBuilderSlice";
import styles from "./FormBuilder.module.css";

export const AddFormField = () => {
  const state = useAppSelector(formBuilderValue);
  const dispatch = useAppDispatch();

  const onFieldTypeChange = (val: string) => {
    console.log("val: ", val);
  };

  const onAdd = (p: Partial<Field>) => console.log(p);

  return (
    <div className={styles.container}>
      Add field
      <button onClick={() => dispatch(actions.addField("text"))}>Text</button>
      <button onClick={() => dispatch(actions.addField("select"))}>
        Select
      </button>
      <button onClick={() => dispatch(actions.addField("checkbox"))}>
        Checkbox
      </button>
      <TextInputDetails onAdd={onAdd} />
    </div>
  );
};

const TextInputDetails = ({
  onAdd,
}: {
  onAdd: (value: Partial<TextField>) => void;
}) => {
  return <div>text details</div>;
};

const SelectInputDetails = () => {
  return <div>select details</div>;
};

const CheckboxInputDetails = () => {
  return <div>checkbox details</div>;
};

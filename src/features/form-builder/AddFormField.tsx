import { useAppDispatch } from "../../app/hooks";
import { actions } from "./formBuilderSlice";
import styles from "./FormBuilder.module.css";

export const AddFormField = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <div>Add field</div>
      <button onClick={() => dispatch(actions.addField("text"))}>Text</button>
      <button onClick={() => dispatch(actions.addField("select"))}>
        Select
      </button>
      <button onClick={() => dispatch(actions.addField("checkbox"))}>
        Checkbox
      </button>
    </div>
  );
};

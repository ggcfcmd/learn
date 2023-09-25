import { forwardRef } from "react";

const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});

const FormField = forwardRef(function FormField(props, ref) {
  return <MyInput ref={ref} />;
});

export default FormField;

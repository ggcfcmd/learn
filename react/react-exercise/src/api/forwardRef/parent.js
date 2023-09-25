import { useRef } from "react";
import FormField from "./child";

const Form = () => {
  const ref = useRef(null);

  function handleClick() {
    console.log(ref);
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name: " ref={ref} />
      <button type="button" onClick={handleClick}>
        编辑
      </button>
    </form>
  );
};

export default Form;

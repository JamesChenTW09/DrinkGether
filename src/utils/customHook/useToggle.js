import { useState } from "react";

const useToggle = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);
  function toggleValue(value) {
    setValue((currentvalue) =>
      typeof value === "boolean" ? value : !currentvalue
    );
  }
  return [value, toggleValue];
};

export default useToggle;

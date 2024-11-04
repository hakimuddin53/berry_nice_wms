import { StandardTextFieldProps, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface DelayedTextFieldProps extends StandardTextFieldProps {
  delay: number;
  onTypingStarted?: () => void;
}
const DelayedTextField: React.FC<DelayedTextFieldProps> = (props) => {
  const [activeTimeout, setActiveTimeout] = React.useState<NodeJS.Timeout>();
  const { value: propsValue, onTypingStarted, ...rest } = props;
  let inputProps = {
    ...props.InputProps?.inputProps,
    onWheel: (e: React.UIEvent<HTMLElement>) => e.currentTarget.blur(),
  };
  //Workaround to allow controlled input
  const [value, setValue] = useState(propsValue);
  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (props.onChange && props.delay) {
      if (activeTimeout) {
        clearTimeout(activeTimeout);
      } else if (onTypingStarted) {
        onTypingStarted();
      }
      setActiveTimeout(
        setTimeout(() => {
          if (props.onChange) {
            props.onChange(event);
          }

          setActiveTimeout(undefined);
        }, props.delay)
      );
    }

    if (propsValue !== undefined) setValue(event.target.value);
  };

  return (
    <TextField
      {...rest}
      value={value}
      onChange={changeHandler}
      InputProps={{ ...props.InputProps, inputProps: inputProps }}
    >
      {rest.children}
    </TextField>
  );
};

export default DelayedTextField;

import { TextField, TextFieldProps } from "@mui/material";

const NumberInput = (props: TextFieldProps) => {
  let inputProps = {
    ...props.InputProps?.inputProps,
    onWheel: (e: React.UIEvent<HTMLElement>) => e.currentTarget.blur(),
  };
  return (
    <TextField
      {...props}
      type="number"
      InputProps={{ inputProps: inputProps }}
    />
  );
};

export default NumberInput;

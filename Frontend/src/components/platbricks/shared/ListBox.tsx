import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

interface ListBoxProps extends React.HTMLAttributes<HTMLUListElement> {}
type NullableUlElement = HTMLUListElement | null;

export const ListBox = forwardRef(function ListBoxBase(
  props: ListBoxProps,
  ref: ForwardedRef<HTMLUListElement>
) {
  const { children, ...rest } = props;

  const innerRef = useRef<HTMLUListElement>(null);
  const childrenArray = React.Children.toArray(children);

  useImperativeHandle<NullableUlElement, NullableUlElement>(
    ref,
    () => innerRef.current
  );

  return (
    // see: https://github.com/mui/material-ui/issues/30249
    <ul
      style={{
        maxHeight: childrenArray.length === 1 ? 50 : 300,
      }}
      {...rest}
      ref={innerRef}
      role="listbox"
    >
      {children}
    </ul>
  );
});

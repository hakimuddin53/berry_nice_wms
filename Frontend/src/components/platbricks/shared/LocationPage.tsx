import React, { Children, Fragment, ReactNode, useMemo } from "react";
import { useParams } from "react-router-dom";

export const LocationPage = ({ children }: { children: ReactNode }) => {
  const { locationId } = useParams();

  const locationPages = useMemo(
    () =>
      Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { key: locationId });
        }
      }),
    [locationId, children]
  );

  return <Fragment>{locationPages}</Fragment>;
};

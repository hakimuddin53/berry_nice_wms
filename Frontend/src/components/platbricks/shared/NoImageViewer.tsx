import React from "react";

interface NoImageViewerProps {
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

export const NoImageViewer: React.FC<NoImageViewerProps> = (props) => {
  return (
    <img
      src="/static/img/share/no-image.png"
      alt=""
      width={props.width ?? 50}
      height={props.height ?? 50}
      style={props.style ?? { cursor: "not-allowed" }}
    />
  );
};

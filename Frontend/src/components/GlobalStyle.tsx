import { Global, css } from "@emotion/react";

const GlobalStyle = (props: any) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }

      body > iframe {
        pointer-events: none;
      }

      ::-webkit-scrollbar {
        width: 10px; /* Adjust the width of the scrollbar */
      }

      ::-webkit-scrollbar-thumb {
        background-color: #888; /* Adjust the color of the thumb (the draggable part) */
        border-radius: 5px; /* Adjust the border radius of the thumb */
      }

      ::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* Adjust the color of the track (the background of the scrollbar) */
      }
    `}
  />
);

export default GlobalStyle;

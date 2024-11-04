import { json } from "@codemirror/lang-json";
import { Info } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { Fragment, useCallback, useEffect, useState } from "react";

import { xcodeLight } from "@uiw/codemirror-theme-xcode";

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  delay?: number;
  editable?: boolean;
  validation?: boolean;
};
const CodeEditor = (props: CodeEditorProps) => {
  const [activeTimeout, setActiveTimeout] = useState<NodeJS.Timeout>();
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { value: propsValue, validation } = props;

  const changeHandler = (value: string) => {
    if (props.onChange) {
      if (props.delay) {
        if (activeTimeout) {
          clearTimeout(activeTimeout);
        }
        setActiveTimeout(
          setTimeout(() => {
            if (props.onChange) {
              props.onChange(value);
            }
          }, props.delay)
        );
      } else {
        props.onChange(value);
      }
    }
  };

  const validateJson = useCallback((text: string) => {
    if (text) {
      try {
        JSON.parse(text);
        setIsValid(true);
      } catch (e) {
        setIsValid(false);
        if (typeof e === "string") {
          setError(e);
        } else if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (validation) {
      validateJson(propsValue);
    }
  }, [propsValue, validation, validateJson]);

  return (
    <Fragment>
      <CodeMirror
        className="custom-code-editor"
        minHeight="150px"
        maxHeight="400px"
        value={props.value}
        extensions={[json()]}
        onChange={changeHandler}
        editable={props.editable}
        minWidth={"300px"}
        maxWidth={"800px"}
        height={"auto"}
        theme={xcodeLight}
        style={{ border: "2px solid #eee" }}
      />
      {validation && !isValid && (
        <div style={{ color: "red" }}>
          {error && (
            <Tooltip title={error}>
              <Info
                fontSize={"small"}
                sx={{
                  verticalAlign: "middle",
                }}
              />
            </Tooltip>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default CodeEditor;

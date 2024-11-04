import { useEffect, useRef } from "react";
import { formikObjectHasTouchedErrors } from "../utils/formikHelpers";
import { UpdateControlsSettings } from "./useDatatableControls";
import { useFieldArray } from "./useFieldArray";

function useFormikDatatable<T>(
  formik: any,
  pageSize: number,
  updateDatatableControls: (settings: UpdateControlsSettings<T>) => void,
  fieldName: string,
  setTouchedFunc: any,
  addFunc: () => any
) {
  const invalidRowsString = useRef("");

  var fieldErrors =
    fieldName
      .replace("]", "")
      .split(/\[|\./)
      .reduce((o, i) => (o ? o[i] : null), formik.errors) ?? [];

  var fieldTouched =
    fieldName
      .replace("]", "")
      .split(/\[|\./)
      .reduce((o, i) => (o ? o[i] : null), formik.touched) ?? [];

  //update Datatable errors
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    let errors: number[] = [];
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach((_: any, y: any) => {
        if (formikObjectHasTouchedErrors(fieldErrors?.[y], fieldTouched?.[y])) {
          errors.push(y);
        }
      });
    }
    const newErrorsString = errors.sort().join(",");
    if (newErrorsString !== invalidRowsString.current) {
      invalidRowsString.current = newErrorsString;
      updateDatatableControls({ invalidRows: errors });
    }
  }, [fieldErrors, fieldTouched]);
  /* eslint-enable */

  //datatable array helper
  const [, { push, removeAndUpdateKeys }] = useFieldArray({
    name: fieldName,
    fieldProps: formik.getFieldProps(fieldName),
    setFieldValue: formik.setFieldValue,
  });

  //addHandler
  const addHandler = () => {
    setTouchedFunc();
    var newData = push(addFunc());
    updateDatatableControls({
      data: newData.map((a: any, b: any) => ({
        ...a,
        key: b,
      })),
      page: Math.max(Math.floor((newData.length - 1) / pageSize), 0),
      selections: [newData.length - 1],
    });
  };

  //removeHandler
  const removeHandler = (indexes: number[]) => {
    if (Math.min(...indexes) < fieldTouched.length) {
      var newValue = JSON.parse(JSON.stringify(fieldTouched));
      for (let index of indexes.sort().reverse()) {
        if (index < newValue.length) newValue.splice(index, 1);
      }
      setTouchedFunc(newValue);
    }
    var newData = removeAndUpdateKeys(indexes);
    updateDatatableControls({
      data: newData.map((a: any, b: any) => ({
        ...a,
        key: b,
      })),
      page: Math.max(Math.floor((newData.length - 1) / pageSize), 0),
      selections: [],
    });
  };

  return { addHandler, removeHandler };
}

export { useFormikDatatable };

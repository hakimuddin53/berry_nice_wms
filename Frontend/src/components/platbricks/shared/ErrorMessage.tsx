import { FormikErrors, FormikTouched } from "formik";
import { Trans, useTranslation } from "react-i18next";

interface YupErrorMessage {
  key: string;
  options: any;
}

interface ErrorMessageProps {
  touched: boolean | undefined | FormikTouched<any>;
  error: YupErrorMessage | string | undefined | FormikErrors<any>;
  translatedFieldName: string;
  translationNamespace?: string;
}

const FormikErrorMessage = (props: ErrorMessageProps) => {
  const { t } = useTranslation("yup");

  if (!props.touched || !props.error) {
    return <></>;
  }

  var error = props.error;
  if (Array.isArray(props.error) && props.error.length >= 1) {
    error = props.error[0];
  }

  if (typeof error === "string") {
    return (
      <>
        {props.error ? (
          <Trans
            ns={props.translationNamespace ?? "yup"}
            i18nKey={error}
            values={{
              field: props.translatedFieldName,
            }} /* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
            components={{ a: <a /> }} /* eslint-enable */
          />
        ) : (
          ""
        )}
      </>
    );
  } else {
    var options = { ...error.options };
    if ("enumValues" in options && typeof options.enumValues === "string") {
      var valueList = options.enumValues.split(",");
      var translatedValueList = valueList.map((v: string) => t(v.trim()));
      options.enumValues = translatedValueList.join(", ");
    }
    if ("max" in options && options.max instanceof Date) {
      options.max = options.max.toISOString();
    } else if ("max" in options) {
      options.count = options.max;
    }
    if ("min" in options && options.min instanceof Date) {
      options.min = options.min.toISOString();
    } else if ("min" in options) {
      options.count = options.min;
    }
    if ("length" in options) {
      options.count = options.length;
    }
    if (error.key === "field-not-type") {
      options.value = JSON.stringify(options.value);
    }
    return (
      <>
        {error ? (
          <Trans
            i18nKey={error.key as string}
            values={{
              ...options,
              field: props.translatedFieldName,
            }} /* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
            components={{ a: <a /> }} /* eslint-enable */
          />
        ) : (
          ""
        )}
      </>
    );
  }
};

export default FormikErrorMessage;

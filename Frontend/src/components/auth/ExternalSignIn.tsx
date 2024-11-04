import styled from "@emotion/styled";
import { Formik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import {
  Button,
  Alert as MuiAlert,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { ValidationResult } from "interfaces/v12/exceptions/HttpResponseMessageV12Dto";
import { useTranslation } from "react-i18next";
import { EMPTY_GUID, guid } from "types/guid";
import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function ExternalSignIn() {
  const navigate = useNavigate();
  const { externalEmailSignIn, externalJwtSignIn } = useAuth();
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();

  let email = searchParams.get("email");
  let companyId = searchParams.get("companyId");
  let locationId = searchParams.get("locationId");
  let jwt = searchParams.get("jwt");
  let redirect = searchParams.get("redirect");

  if (jwt) {
    externalJwtSignIn(jwt).then((response) => {
      if (response) {
        let externalRedirectUrl = `/auth/sign-in/external?companyId=${response.companyId}&email=${response.email}&locationId=${response.locationId}`;
        navigate(externalRedirectUrl, { replace: true });
      } else {
        if (redirect) {
          navigate(redirect);
        } else {
          navigate("/");
        }
      }
    });
  }

  return (
    <Formik
      initialValues={{
        email: email || "",
        companyId: companyId,
        locationId: locationId,
        submit: false,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().max(255).required(),
        companyId: Yup.mixed<guid>().required(),
        locationId: Yup.mixed<guid>().nullable(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          externalEmailSignIn(
            values.companyId as guid,
            values.email,
            (values.locationId || EMPTY_GUID) as guid
          )
            .then(() => {
              setStatus({
                success: t("email-with-login-link-has-been-sent"),
              });
            })
            .catch((response) => {
              let errorMessages = response.data as ValidationResult[];
              let displayMessage = "";
              errorMessages.forEach((errorMessages) => {
                displayMessage += t(errorMessages.errorCode, {
                  ns: "validationResult",
                });
              });

              setStatus({ success: false });
              setErrors({ submit: displayMessage });
            })
            .finally(() => {
              setSubmitting(false);
            });
        } catch (error: any) {
          const message = error.message || t("common:something-went-wrong");

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        status,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
              {errors.submit}
            </Alert>
          )}
          {console.log(status)}
          {status && status.success && (
            <Alert mt={2} mb={3} severity="success">
              {status.success}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label={t("common:email")}
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={
              <FormikErrorMessage
                touched={touched.email}
                error={errors.email}
                translatedFieldName={t("common:email")}
              />
            }
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {t("request-login-link")}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default ExternalSignIn;

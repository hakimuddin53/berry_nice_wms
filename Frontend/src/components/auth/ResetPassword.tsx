import styled from "@emotion/styled";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  Button,
  Alert as MuiAlert,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function ResetPassword() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  return (
    <Formik
      initialValues={{
        email: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().max(255).required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          resetPassword(values.email);
          navigate("/auth/sign-in");
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
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
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
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {t("reset-password")}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default ResetPassword;

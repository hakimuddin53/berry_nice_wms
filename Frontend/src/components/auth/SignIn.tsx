import styled from "@emotion/styled";
import { Formik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import {
  Button,
  Checkbox,
  FormControlLabel,
  Alert as MuiAlert,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import FormikErrorMessage from "components/platbricks/shared/ErrorMessage";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().max(255).required(),
        password: Yup.string().max(255).required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signIn(values.email, values.password);

          const redirectUri =
            (searchParams.get("redirect") || "") +
            "?" +
            decodeURIComponent(searchParams.get("searchQuery") || "");

          if (redirectUri === "" || redirectUri === "?") {
            navigate("/");
          }

          navigate(redirectUri);
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
            <Alert mt={2} mb={3} severity="warning">
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
            my={2}
          />
          <TextField
            type="password"
            name="password"
            label={t("password")}
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={
              <FormikErrorMessage
                touched={touched.password}
                error={errors.password}
                translatedFieldName={t("password")}
              />
            }
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t("remember-me")}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {t("sign-in")}
          </Button>
          <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
          >
            {t("forgot-password")}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;

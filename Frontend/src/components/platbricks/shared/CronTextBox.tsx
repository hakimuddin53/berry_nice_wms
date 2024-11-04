import { Settings } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import { FormikProvider, useFormik } from "formik";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormikErrorMessage from "./ErrorMessage";

interface CronTextBoxProps extends StandardTextFieldProps {
  title: string;
  value?: string;
  onChanged: (value: string) => void;
}

export const CronTextBox: React.FC<CronTextBoxProps> = ({
  title,
  value,
  onChanged,
  ...props
}) => {
  const { t } = useTranslation("hangfire");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeDialog = () => {
    setOpen(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      cronMinutes: "0",
      cronHours: "0",
      cronDayOfMonth: "*",
      cronMonth: "*",
      cronDayOfWeek: "*",
      cronExpression: "0 0 * * *",
    } as YupCronCreateEdit,
    validationSchema: CronCreateEditSchema,
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      onChanged(formik.values.cronExpression);
      closeDialog();

      setLoading(false);
    },
    onReset: () => {},
    enableReinitialize: true,
  });

  const handleEntering = () => {
    let cronValues = value?.split(" ") ?? "";
    let minute = cronValues.length === 5 ? cronValues[0] : "0";
    let hour = cronValues.length === 5 ? cronValues[1] : "0";
    let dayOfMonth = cronValues.length === 5 ? cronValues[2] : "*";
    let month = cronValues.length === 5 ? cronValues[3] : "*";
    let dayOfWeek = cronValues.length === 5 ? cronValues[4] : "*";

    formik.setValues({
      cronMinutes: minute,
      cronHours: hour,
      cronDayOfMonth: dayOfMonth,
      cronMonth: month,
      cronDayOfWeek: dayOfWeek,
      cronExpression: value ?? "",
    });
  };

  const cronExpressionChanges = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(event.target.id, event.target.value);

      var minutes = formik.values.cronMinutes;
      var hours = formik.values.cronHours;
      var dayOfMonth = formik.values.cronDayOfMonth;
      var month = formik.values.cronMonth;
      var dayOfWeek = formik.values.cronDayOfWeek;
      if (event.target.value) {
        switch (event.target.id) {
          case "cronMinutes":
            minutes = event.target.value;
            break;
          case "cronHours":
            hours = event.target.value;
            break;
          case "cronDayOfMonth":
            dayOfMonth = event.target.value;
            break;
          case "cronMonth":
            month = event.target.value;
            break;
          case "cronDayOfWeek":
            dayOfWeek = event.target.value;
            break;
        }
      }
      formik.setFieldValue(
        "cronExpression",
        minutes + " " + hours + " " + dayOfMonth + " " + month + " " + dayOfWeek
      );
    },
    [formik]
  );
  return (
    <>
      <TextField
        value={value}
        {...props}
        onClick={() => setOpen(true)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setOpen(true)} edge="end">
                <Settings />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Dialog
        open={open}
        fullWidth={true}
        maxWidth="sm"
        TransitionProps={{ onEntering: handleEntering }}
      >
        <Box>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <Box style={{ fontWeight: 700, padding: 10, marginBottom: 5 }}>
                  {t("cron-utc")}
                </Box>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <TextField
                    label={t("minutes")}
                    fullWidth
                    id="cronMinutes"
                    name="cronMinutes"
                    size="small"
                    style={{ maxWidth: 100 }}
                    value={formik.values.cronMinutes}
                    onChange={cronExpressionChanges}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cronMinutes &&
                      Boolean(formik.errors.cronMinutes)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.cronMinutes}
                        error={formik.errors.cronMinutes}
                        translatedFieldName={t("minutes")}
                      />
                    }
                  />
                  <TextField
                    label={t("hours")}
                    fullWidth
                    id="cronHours"
                    name="cronHours"
                    size="small"
                    style={{ maxWidth: 100 }}
                    value={formik.values.cronHours}
                    onChange={cronExpressionChanges}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cronHours &&
                      Boolean(formik.errors.cronHours)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.cronHours}
                        error={formik.errors.cronHours}
                        translatedFieldName={t("hours")}
                      />
                    }
                  />
                  <TextField
                    label={t("day-of-month")}
                    fullWidth
                    id="cronDayOfMonth"
                    name="cronDayOfMonth"
                    size="small"
                    style={{ maxWidth: 100 }}
                    value={formik.values.cronDayOfMonth}
                    onChange={cronExpressionChanges}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cronDayOfMonth &&
                      Boolean(formik.errors.cronDayOfMonth)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.cronDayOfMonth}
                        error={formik.errors.cronDayOfMonth}
                        translatedFieldName={t("day-of-month")}
                      />
                    }
                  />
                  <TextField
                    label={t("month")}
                    fullWidth
                    id="cronMonth"
                    name="cronMonth"
                    size="small"
                    style={{ maxWidth: 100 }}
                    value={formik.values.cronMonth}
                    onChange={cronExpressionChanges}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cronMonth &&
                      Boolean(formik.errors.cronMonth)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.cronMonth}
                        error={formik.errors.cronMonth}
                        translatedFieldName={t("month")}
                      />
                    }
                  />
                  <TextField
                    label={t("day-of-week")}
                    fullWidth
                    id="cronDayOfWeek"
                    name="cronDayOfWeek"
                    size="small"
                    style={{ maxWidth: 100 }}
                    value={formik.values.cronDayOfWeek}
                    onChange={cronExpressionChanges}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cronDayOfWeek &&
                      Boolean(formik.errors.cronDayOfWeek)
                    }
                    helperText={
                      <FormikErrorMessage
                        touched={formik.touched.cronDayOfWeek}
                        error={formik.errors.cronDayOfWeek}
                        translatedFieldName={t("day-of-week")}
                      />
                    }
                  />
                </Stack>
                <Stack>
                  <FormHelperText error={true}>
                    <FormikErrorMessage
                      touched={formik.touched.cronExpression}
                      error={formik.errors.cronExpression}
                      translatedFieldName=""
                      translationNamespace="yup"
                    />
                  </FormHelperText>
                </Stack>
              </form>
            </FormikProvider>
          </DialogContent>
        </Box>
        <DialogActions>
          <Button
            color={"inherit"}
            variant="contained"
            onClick={() => closeDialog()}
          >
            {t("common:cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={loading}
            onClick={() => formik.submitForm()}
            disabled={loading}
          >
            {t("common:save")}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const CronCreateEditSchema = yup.object({
  cronMinutes: yup.string().required(),
  cronHours: yup.string().required(),
  cronDayOfMonth: yup.string().required(),
  cronMonth: yup.string().required(),
  cronDayOfWeek: yup.string().required(),
  cronExpression: yup
    .string()
    .required()
    .max(32)
    .matches(
      /^(\*|[0-9,\-/*]+)\s+(\*|[0-9,\-/*]+)\s+(\*|[0-9,\-/*]+)\s+(\*|[0-9,\-/*]+)\s+(\*|[0-9,\-/*]+)$/,
      "match-cron-regex-expression"
    ),
});

export type YupCronCreateEdit = yup.InferType<typeof CronCreateEditSchema>;

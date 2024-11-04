import { MenuItem, Select } from "@mui/material";
import { FormikProps } from "formik";
import { LengthUnit } from "interfaces/enums/GlobalEnums";
import { useTranslation } from "react-i18next";

const LengthUnitSelect = (props: {
  id: string;
  name: string;
  formik: FormikProps<any>;
}) => {
  const { t } = useTranslation();
  const formik = props.formik;
  const exclusion: LengthUnit[] = [
    LengthUnit.Angstroms,
    LengthUnit.DataMiles,
    LengthUnit.Decameters,
    LengthUnit.Femtometers,
    LengthUnit.Gigameters,
    LengthUnit.Kilofeet,
    LengthUnit.Kiloyards,
    LengthUnit.Megameters,
    LengthUnit.Parsecs,
    LengthUnit.Picometers,
    LengthUnit.SolarRadiuses,
    LengthUnit.UsSurveyFeet,
  ];
  return (
    <Select
      fullWidth
      id={props.id}
      name={props.name}
      size="small"
      value={formik.values.lengthUnit}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.lengthUnit && Boolean(formik.errors.lengthUnit)}
      displayEmpty
      renderValue={(selected) => {
        if (!selected?.length || selected.length === 0) {
          return <em>{t("common:please-select")}</em>;
        }

        return t(selected, { ns: "enumerables" });
      }}
    >
      {Object.values(LengthUnit)
        .filter((length) => !exclusion.includes(length))
        .sort()
        .map((p) => (
          <MenuItem value={p} key={p}>
            {t(p, { ns: "enumerables" })}
          </MenuItem>
        ))}
    </Select>
  );
};

export default LengthUnitSelect;

import { MenuItem, Select } from "@mui/material";
import { FormikProps } from "formik";
import { MassUnit } from "interfaces/enums/GlobalEnums";
import { useTranslation } from "react-i18next";

const MassUnitSelect = (props: {
  id: string;
  name: string;
  formik: FormikProps<any>;
}) => {
  const { t } = useTranslation();
  const formik = props.formik;
  const exclusion: MassUnit[] = [
    MassUnit.EarthMasses,
    MassUnit.Femtograms,
    MassUnit.Picograms,
    MassUnit.SolarMasses,
  ];
  return (
    <Select
      fullWidth
      id={props.id}
      name={props.name}
      size="small"
      value={formik.values.massUnit}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.massUnit && Boolean(formik.errors.massUnit)}
      displayEmpty
      renderValue={(selected) => {
        if (!selected?.length || selected.length === 0) {
          return <em>{t("common:please-select")}</em>;
        }

        return t(selected, { ns: "enumerables" });
      }}
    >
      {Object.values(MassUnit)
        .filter((mass) => !exclusion.includes(mass))
        .sort()
        .map((p) => (
          <MenuItem value={p} key={p}>
            {t(p, { ns: "enumerables" })}
          </MenuItem>
        ))}
    </Select>
  );
};

export default MassUnitSelect;

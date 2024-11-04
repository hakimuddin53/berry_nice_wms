import { MenuItem, Select } from "@mui/material";
import { FormikProps } from "formik";
import { VolumeUnit } from "interfaces/enums/GlobalEnums";
import { useTranslation } from "react-i18next";

const VolumeUnitSelect = (props: {
  id: string;
  name: string;
  formik: FormikProps<any>;
}) => {
  const { t } = useTranslation();
  const formik = props.formik;
  const exclusion: VolumeUnit[] = [
    VolumeUnit.BoardFeet,
    VolumeUnit.Decaliters,
    VolumeUnit.DecausGallons,
    VolumeUnit.DeciusGallons,
    VolumeUnit.KilocubicFeet,
    VolumeUnit.Nanoliters,
  ];
  return (
    <Select
      fullWidth
      id={props.id}
      name={props.name}
      size="small"
      value={formik.values.volumeUnit}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.volumeUnit && Boolean(formik.errors.volumeUnit)}
      displayEmpty
      renderValue={(selected) => {
        if (!selected?.length || selected.length === 0) {
          return <em>{t("common:please-select")}</em>;
        }

        return t(selected, { ns: "enumerables" });
      }}
    >
      {Object.values(VolumeUnit)
        .filter((volume) => !exclusion.includes(volume))
        .sort()
        .map((p) => (
          <MenuItem value={p} key={p}>
            {t(p, { ns: "enumerables" })}
          </MenuItem>
        ))}
    </Select>
  );
};

export default VolumeUnitSelect;

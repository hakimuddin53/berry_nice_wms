import styled from "@emotion/styled";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import { ExportFileDto } from "interfaces/general/fileExport/exportFileDto";
import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

const TextFieldLabel = styled(Grid)`
  padding-bottom: 10px;
  text-align: left;
  font-weight: 700;
`;

const TextFieldSubtitle = styled(Grid)`
  text-align: left;
  font-weight: 350;
`;

const TextFieldValue = styled(Grid)`
  padding-top: 0 !important;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-right: 5px;
`;

export interface FileExportProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onFileExport: (fileExport: ExportFileDto) => void;
}

export const FileExportDialog = (props: FileExportProps) => {
  const { t } = useTranslation();
  let fileExportRef = useRef<ExportFileDto>({
    locale: "en-US",
  });

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onFileExport(fileExportRef.current);
    props.onClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onClose={props.onClose}>
        <Box component="form" onSubmit={submitHandler}>
          <DialogTitle>{props.title ?? t("common:export")}</DialogTitle>
          <DialogContent>
            <TextFieldLabel item xs={3}>
              {t("common:culture-for-csv-export")}
            </TextFieldLabel>
            <TextFieldValue item xs={9}>
              <Select
                fullWidth
                id="volumeUnit"
                name="volumeUnit"
                size="small"
                onChange={(e) => {
                  fileExportRef.current.locale = e.target.value;
                }}
                displayEmpty
                defaultValue="en-US"
                renderValue={(selected: string) => {
                  if (selected.length === 0) {
                    return <em>{t("common:please-select")}</em>;
                  }

                  return t(selected, { ns: "enumerables" });
                }}
              >
                {Object.values(["en-US", "en-GB"]).map((p) => (
                  <MenuItem value={p} key={p}>
                    {t(p, { ns: "enumerables" })}
                  </MenuItem>
                ))}
              </Select>
            </TextFieldValue>
            <TextFieldSubtitle>{t("common:export-help")}</TextFieldSubtitle>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.onClose()} color="primary">
              {t("common:cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("common:export")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  );
};

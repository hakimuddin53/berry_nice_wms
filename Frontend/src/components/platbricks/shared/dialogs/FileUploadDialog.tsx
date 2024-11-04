import styled from "@emotion/styled";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { UploadFileDto } from "interfaces/general/fileUpload/uploadFileDto";
import { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";

const TextFieldLabel = styled(Grid)`
  text-align: left;
  font-weight: 700;
`;

const TextFieldSubtitle = styled(Grid)`
  text-align: left;
  font-weight: 350;
`;

const TextFieldValue = styled(Grid)`
  padding-top: 0 !important;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-right: 5px;
`;

export interface FileUploadProps {
  open: boolean;
  title?: string;
  sampleFileUrl: string;
  onClose: () => void;
  onFileUpload: (fileUpload: UploadFileDto) => void;
}

export const FileUploadDialog = (props: FileUploadProps) => {
  const { t } = useTranslation();
  const fileUploadRef = useRef<UploadFileDto>({
    fileBase64String: "",
    fileName: "",
    fileType: "",
    columnDelimiter: ";",
    textQualifier: '"',
  });

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onFileUpload(fileUploadRef.current!);
    props.onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files !== undefined &&
      event.target.files !== null &&
      event.target.files.length > 0
    ) {
      const fileName = event.target.files[0].name;
      const file = event.target.files[0] || null;
      const fileType = event.target.files[0].type;

      if (file) {
        const reader = new FileReader();

        // Read the selected file as a data URL, which will give us a Base64 encoded string
        reader.readAsDataURL(file);

        reader.onload = function (e) {
          const base64FileString = e.target?.result; // This is the Base64 encoded image
          fileUploadRef.current.fileBase64String = base64FileString;
          fileUploadRef.current.fileName = fileName;
          fileUploadRef.current.fileType = fileType;
        };
      }
    }
  };

  return (
    <Fragment>
      <Dialog open={props.open} onClose={props.onClose}>
        <Box component="form" onSubmit={submitHandler}>
          <DialogTitle>{props.title ?? t("common:upload-file")}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={3}>
              <Grid item xs={12}>
                <TextFieldLabel item xs={3}>{`${t(
                  "common:select-upload-file"
                )}:`}</TextFieldLabel>
                <TextFieldValue item xs={9}>
                  <TextField
                    fullWidth
                    id="fileUploadId"
                    name="fileUploadName"
                    size="small"
                    value={undefined}
                    onChange={handleFileChange}
                    type="file"
                  />
                </TextFieldValue>
              </Grid>
              <Grid item xs={12}>
                <TextFieldLabel item xs={3}>{`${t(
                  "common:column-delimiter"
                )}:`}</TextFieldLabel>
                <TextFieldValue item xs={9}>
                  <TextField
                    fullWidth
                    id="columnDelimiter"
                    name="columnDelimiter"
                    size="small"
                    onChange={(e) => {
                      fileUploadRef.current.columnDelimiter = e.target.value;
                    }}
                  />
                </TextFieldValue>
                <TextFieldSubtitle item xs={9}>
                  {t("common:column-delimiter-helper")}
                </TextFieldSubtitle>
              </Grid>
              <Grid item xs={12}>
                <TextFieldLabel item xs={3}>{`${t(
                  "common:text-qualifier"
                )}:`}</TextFieldLabel>
                <TextFieldValue item xs={9}>
                  <TextField
                    fullWidth
                    id="textQualifier"
                    name="textQualifier"
                    size="small"
                    onChange={(e) => {
                      fileUploadRef.current.textQualifier = e.target.value;
                    }}
                  />
                </TextFieldValue>
                <TextFieldSubtitle item xs={9}>
                  {t("common:text-qualifier-helper")}
                </TextFieldSubtitle>
              </Grid>
              <Grid xs={3}></Grid>
              <Grid xs={9}>
                {props.sampleFileUrl !== undefined &&
                props.sampleFileUrl.length > 0 ? (
                  <div>
                    {t("common:click")}{" "}
                    <a
                      href={props.sampleFileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("common:here")}
                    </a>{" "}
                    {t("common:to-download-a-sample-file")}
                  </div>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.onClose()} color="primary">
              {t("common:cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("common:upload")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  );
};

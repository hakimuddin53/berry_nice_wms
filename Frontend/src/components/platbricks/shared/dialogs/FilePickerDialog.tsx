import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
// import DocumentService from "services/DocumentService";
import { guid } from "types/guid";
import ImageViewer from "../ImageViewer";

export interface UploadFiles {
  id: guid;
  file: File;
}

export const FilePickerDialog = ({
  open,
  onClose,
  propsUploadedFiles,
  onAddDocuments,
  acceptedFileTypes,
}: {
  open: boolean;
  onClose: () => void;
  propsUploadedFiles?: UploadFiles[];
  onAddDocuments: (uploadedFiles: UploadFiles[]) => void;
  acceptedFileTypes?: string[]; // ["image/jpeg","image/png","application/pdf"]
}) => {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadFiles[]>([]);
  const [uploadInProgress, showUploadInProgress] = useState<boolean>(false);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddDocuments(uploadedFiles);
    onClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      showUploadInProgress(true);

      let newFiles: UploadFiles[] = [];
      for await (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("fileName", file.name);
        formData.append("formFile", file);

        //var result = await DocumentService.createDocumentAsync(formData);
        // newFiles.push({ id: result.id, file });
      }

      setUploadedFiles([...uploadedFiles, ...newFiles]);
      showUploadInProgress(false);
    },
    accept: acceptedFileTypes
      ? Object.fromEntries(acceptedFileTypes.map((type) => [type, []]))
      : undefined,
    disabled: uploadInProgress ? true : false,
  });

  const handleEntering = () => {
    setUploadedFiles(propsUploadedFiles ?? []);
    showUploadInProgress(false);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === "backdropClick" && uploadInProgress) return;
    onClose();
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionProps={{ onEntering: handleEntering }}
      >
        <Box component="form" onSubmit={submitHandler}>
          <DialogTitle>{t("common:add-documents")}</DialogTitle>
          <DialogContent>
            <div
              {...getRootProps()}
              className={`drop-area ${isDragActive ? "active" : ""}`}
              style={{
                border: "2px dashed #ccc",
                borderRadius: "4px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon style={{ fontSize: "48px", color: "#ccc" }} />
              <p style={{ margin: "0" }}>
                {t("drag-and-drop-files-here-or-click-to-browse-files")}
              </p>
            </div>

            {acceptedFileTypes && (
              <p style={{ marginTop: "5px", color: "#666" }}>
                {`${t("common:accepted-file-types")}: ${acceptedFileTypes?.join(
                  ", "
                )}`}
              </p>
            )}

            {uploadInProgress && (
              <LinearProgress sx={{ mt: 2, width: "100%" }} />
            )}

            {uploadedFiles.length > 0 && (
              <div
                style={{
                  marginTop: "8px",
                  border: "2px solid  #ccc",
                  textAlign: "center",
                }}
              >
                {uploadedFiles.map((fileObject, index) => (
                  <Fragment key={fileObject.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            const updatedFiles = uploadedFiles.filter(
                              (file) => file.id !== fileObject.id
                            );
                            setUploadedFiles(updatedFiles);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      }
                    >
                      {fileObject.file.type.startsWith("image/") ? (
                        <ImageViewer
                          imageUrl={URL.createObjectURL(fileObject.file)}
                          title={fileObject.file.name}
                          height={30}
                          width={30}
                        />
                      ) : (
                        <ListItemText primary={fileObject.file.name} />
                      )}
                    </ListItem>

                    {index !== uploadedFiles.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => onClose()}
              color="primary"
              disabled={uploadInProgress ? true : false}
            >
              {t("common:cancel")}
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={uploadInProgress ? true : false}
            >
              {t("common:ok")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  );
};

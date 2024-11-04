import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ImageViewerProps {
  imageUrl: string;
  title: string;
  height?: number;
  width?: number;
  imageViewHeight?: number;
  imageViewWidth?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const [imgDimensions, setImgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = event.target as HTMLImageElement;
    setImgDimensions({
      height: props.imageViewHeight ? props.imageViewHeight : img.naturalHeight,
      width: props.imageViewWidth ? props.imageViewWidth : img.naturalWidth,
    });
  };

  return (
    <>
      {props.imageUrl ? (
        <Tooltip title={t("common:click-to-enlarge")}>
          <img
            src={props.imageUrl}
            alt={t("common:image-not-found")}
            width={props.height ? props.height : 50}
            height={props.width ? props.width : 50}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <Tooltip title={t("common:image-not-found")}>
          <Skeleton
            variant="rectangular"
            animation={false}
            width={props.height ? props.height : 50}
            height={props.width ? props.width : 50}
            style={{ cursor: "not-allowed" }}
          />
        </Tooltip>
      )}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={"lg"}>
        <DialogTitle>
          {closeDialog ? (
            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
          {t("common:item")}
          {props.title}
        </DialogTitle>
        <DialogContent>
          <img
            src={props.imageUrl}
            alt={t("common:image-not-found")}
            width={imgDimensions.width!}
            height={imgDimensions.height!}
            onLoad={handleImageLoad}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="contained">
            {t("common:close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ImageViewer;

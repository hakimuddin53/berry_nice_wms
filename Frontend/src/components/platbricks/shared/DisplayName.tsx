import { Box, Tooltip, Typography } from "@mui/material";
import { CacheObjectStateMessage } from "interfaces/enums/CacheObjectStateEnums";
import { useTranslation } from "react-i18next";

interface DisplayNameProps {
  displayText: string;
}

const DisplayName = (props: DisplayNameProps) => {
  const { t } = useTranslation("cacheObjectState");

  let tooltipTitle = "";
  let italicStyled = false;

  switch (props.displayText) {
    case CacheObjectStateMessage.LOADING:
      tooltipTitle = t("state-loading-tooltip");
      break;
    case CacheObjectStateMessage.NOTFOUND:
      tooltipTitle = t("state-notfound-tooltip");
      break;
    case CacheObjectStateMessage.UNKNOWN:
      tooltipTitle = t("state-unknown-tooltip");
      italicStyled = true;
      break;
    case CacheObjectStateMessage.ERROR:
      tooltipTitle = t("state-error-tooltip");
      italicStyled = true;
      break;
    default:
      break;
  }

  return (
    <Tooltip title={tooltipTitle} placement="bottom-start">
      <Typography component="div">
        <Box sx={{ fontStyle: italicStyled ? "italic" : "normal" }}>
          {t(props.displayText)}
        </Box>
      </Typography>
    </Tooltip>
  );
};

export default DisplayName;

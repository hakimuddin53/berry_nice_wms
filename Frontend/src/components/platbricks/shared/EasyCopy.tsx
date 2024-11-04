import styled from "@emotion/styled";
import { ContentCopy, QrCodeScanner } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNotificationService } from "services/NotificationService";

const CopyWrapper = styled.span`
  display: inline-flex;
  &:hover .showOnHover {
    visibility: visible;
  }
`;
const ShowOnHover = styled.span`
  visibility: hidden;
  display: flex;
  align-items: center;
  & svg {
    font-size: 14px;
    line-height: 14px;
    margin-left: 0.25rem;
    cursor: pointer;
  }
`;

interface EasyCopyProps {
  children: React.ReactNode;
  clipboard?: string;
  qrCode?: string;
}

const EasyCopy: React.FC<EasyCopyProps> = (props) => {
  const notificationService = useNotificationService();
  const { t } = useTranslation();
  const copyToClipboard = () => {
    props.clipboard && navigator.clipboard.writeText(props.clipboard);
    notificationService.handleSuccessMessage(
      t("common:copied-value-to-clipboard")
    );
  };
  return (
    <CopyWrapper>
      {props.children}
      {props.clipboard && (
        <ShowOnHover className="showOnHover" onClick={copyToClipboard}>
          <Tooltip title={t("common:copy")} placement="top">
            <ContentCopy></ContentCopy>
          </Tooltip>
        </ShowOnHover>
      )}
      {props.qrCode && (
        <ShowOnHover className="showOnHover">
          <Tooltip title={t("common:qr-code")} placement="top">
            <QrCodeScanner></QrCodeScanner>
          </Tooltip>
        </ShowOnHover>
      )}
    </CopyWrapper>
  );
};

export default EasyCopy;

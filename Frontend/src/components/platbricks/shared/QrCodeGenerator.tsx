// src/components/QRCodeGenerator.tsx

import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";
import { spacing } from "@mui/system";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import React, { useRef, useState } from "react";

const Button = styled(MuiButton)(spacing);

// Define the shape of the component's state if needed
interface QRCodeGeneratorProps {
  serialNumber?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  serialNumber = "SN1234567890",
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle QR code download
  const downloadQRCode = () => {
    if (qrRef.current === null) {
      return;
    }

    setIsLoading(true);
    toPng(qrRef.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement("a");
        link.download = `${serialNumber}-qr-code.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.error("Failed to download QR Code as image", err);
        alert("Failed to download QR Code. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <div ref={qrRef}>
        <QRCodeSVG
          value={serialNumber}
          size={256}
          level={"H"}
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <Button
        ml={10}
        variant="contained"
        color="primary"
        onClick={downloadQRCode}
      >
        {isLoading ? "Downloading..." : "Download QR Code"}
      </Button>
    </div>
  );
};

export default QRCodeGenerator;

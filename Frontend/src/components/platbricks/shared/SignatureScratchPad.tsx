import styled from "@emotion/styled";
import { useRef } from "react";
import {
  default as ReactSignatureCanvas,
  default as SignaturePad,
} from "react-signature-canvas";

const CanvasContainer = styled.div`
  margin: 0 auto;
  height: 150px;
`;

export const SignatureScratchPad = ({
  setSignature,
}: {
  setSignature: (signature: string | undefined) => void;
}) => {
  let sigCanvas = useRef<ReactSignatureCanvas>(null);

  const formatIntoPng = () => {
    if (!sigCanvas.current?.isEmpty()) {
      const signatureImage = sigCanvas.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png");

      setSignature(signatureImage);
    }
  };

  return (
    <CanvasContainer>
      <SignaturePad
        ref={sigCanvas}
        onEnd={() => formatIntoPng()}
        penColor="black"
        canvasProps={{
          style: {
            border: "1px solid rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            width: "100%",
            height: "100%",
          },
        }}
      />
    </CanvasContainer>
  );
};

import { ViewStepMapper } from "interfaces/general/viewStepMapper/viewStepMapper";
import { useCallback, useState } from "react";

export const useStep = () => {
  const [activeStep, setActiveStep] = useState(0);

  const getConvertedStep = useCallback(
    (mapper: ViewStepMapper[]): number => {
      let value = 0;

      if (mapper) {
        let kpv = mapper.find((x) => x.SourceSteps.includes(activeStep));

        if (kpv) {
          value = kpv.TargetStep;
        }
      }

      return value;
    },
    [activeStep]
  );

  return { getConvertedStep, activeStep, setActiveStep };
};

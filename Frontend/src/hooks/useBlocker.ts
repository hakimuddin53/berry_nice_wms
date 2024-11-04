import type { Transition } from "history";
import { useContext, useEffect, useRef } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker: any, when = true) {
  const { navigator } = useContext(NavigationContext) as any;

  //main tweak required to OP was wrapping unblock in ref so we're only pushing one blocker on the stack per each useBlocker hook declaration (i.e. not one for every render)
  const refUnBlock = useRef<() => void>();

  useEffect(() => {
    if (!when) {
      refUnBlock.current?.();
      return;
    }

    if (!refUnBlock.current)
      refUnBlock.current = navigator.block((tx: any) => {
        const autoUnblockingTx = {
          ...tx,
          retry() {
            refUnBlock.current?.(); //need to unblock so retry succeeds
            tx.retry();
          },
        };

        blocker(autoUnblockingTx);
      });
  }, [navigator, blocker, when]);
}

export type Tx = Transition & { retry: () => void };

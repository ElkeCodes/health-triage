"use client";

import * as React from "react";

function useScrollToTop<T>(valueToCheck: T) {
  const hasMountedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [valueToCheck]);
}

export { useScrollToTop };
